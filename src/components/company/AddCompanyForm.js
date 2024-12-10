import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, IconButton, Modal } from '@mui/material';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AddCompanyForm = () => {
    const [companyName, setCompanyName] = useState('');
    const [items, setItems] = useState([{ name: '', price: '', image: '' }]);
    const [openModal, setOpenModal] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const companyData = location.state?.company; // Access company data passed from CompanyList

    // Prefill form if editing an existing company
    useEffect(() => {
        if (companyData) {
            setCompanyName(companyData.name);
            setItems(companyData.items || [{ name: '', price: '', image: '' }]);
        }
    }, [companyData]);

    const handleAddItem = () => {
        setItems([...items, { name: '', price: '', image: '' }]);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const handleImageUpload = async (index, event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', "Company's-Items"); // Replace with your Cloudinary upload preset

        try {
            setLoading(true)
            // Send the request to Cloudinary
            const response = await axios.post(
                `https://api.x.com/v1_1/dzsxyuits/image/upload`, // Replace 'your-cloud-name' with your Cloudinary cloud name
                formData
            );

            const imageUrl = response.data.secure_url;
            const updatedItems = [...items];
            updatedItems[index].image = imageUrl;
            setItems(updatedItems);

            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error uploading image:', error);
        }
    };

    const handleViewImage = (imageUrl, e) => {
        e.stopPropagation();
        setCurrentImage(imageUrl);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentImage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            name: companyName,
            items: items,
        };

        try {
            let response;
            if (companyData) {
                response = await fetch(`http://localhost:3001/api/products/${companyData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
            } else {
                response = await fetch('http://localhost:3001/api/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });
            }

            if (response.ok) {
                navigate('/');
            } else {
                console.error('Error creating/updating product:', response.statusText);
            }
        } catch (error) {
            console.error('Error making request:', error);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                {companyData ? 'Edit Company' : 'Add New Company'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Company Name"
                    variant="outlined"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                {items.map((item, index) => (
                    <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
                        <Grid item xs={6}>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                {`Item ${index + 1}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleRemoveItem(index)}
                                startIcon={<DeleteIcon />}
                            >
                                Remove Item
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                variant="outlined"
                                value={item.name}
                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                variant="outlined"
                                value={item.price}
                                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px solid #ccc',
                                    padding: 1,
                                    cursor: 'pointer',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f7f7f7',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onClick={() => document.getElementById(`image-upload-${index}`).click()}
                            >
                                {item.image ? (
                                    <>
                                        <img
                                            src={item.image}
                                            alt="uploaded"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                objectFit: 'contain',
                                            }}
                                        />
                                        <Button
                                            sx={{
                                                position: 'absolute',
                                                bottom: 10,
                                                right: 10,
                                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                color: 'white',
                                                fontSize: 12,
                                                padding: '4px 8px',
                                            }}
                                            onClick={(e) => handleViewImage(item.image, e)}
                                        >
                                            View
                                        </Button>
                                    </>
                                ) : (
                                    <Typography variant="body2" color="textSecondary">
                                        Click or drag to upload an image
                                    </Typography>
                                )}
                                <input
                                    type="file"
                                    id={`image-upload-${index}`}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageUpload(index, e)}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                ))}

                <IconButton onClick={handleAddItem} color="primary" sx={{ marginBottom: 2 }}>
                    <AddCircleIcon /> Add Item
                </IconButton>

                <Box sx={{ marginTop: 2 }}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Submit
                    </Button>
                </Box>
            </form>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: 2,
                        borderRadius: 2,
                        maxWidth: '90%',
                        maxHeight: '90%',
                    }}
                >
                    <img
                        src={currentImage}
                        alt="Uploaded Image"
                        style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'contain',
                        }}
                    />
                    <Button
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            color: 'white',
                            fontSize: 14,
                            padding: '4px 8px',
                        }}
                        onClick={handleCloseModal}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default AddCompanyForm;
