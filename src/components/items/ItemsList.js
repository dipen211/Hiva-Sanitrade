import React from 'react';
import { Box, Button, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { AddCircle as AddCircleIcon, AddShoppingCart as AddShoppingCartIcon } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompanyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const companyData = location.state?.company;

    const handleEditClick = (company) => {
        navigate('/add-company', { state: { company } });
    };

    const handleAddToInvoice = async (item) => {
        try {
            const data = {
                companyName: companyData.name,
                productName: item.name,
                price: item.price,
                quantity: 1,
                image: item.image,
            }
            await axios.post('http://localhost:3001/api/cart', data);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    if (!companyData) {
        return <Typography variant="h6">No company data available</Typography>;
    }

    return (
        <Box sx={{ padding: 3, backgroundColor: '#f9f9f9' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                    {companyData.name}
                </Typography>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleEditClick(companyData)}
                >
                    Update Items
                </Button>
            </Box>

            <Grid container spacing={3}>
                {companyData.items.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card sx={{ backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={item.image}
                                alt={item.name}
                                sx={{
                                    objectFit: 'cover',
                                    borderTopLeftRadius: '8px',
                                    borderTopRightRadius: '8px',
                                }}
                            />
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        {item.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                        ₹{item.price.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<AddShoppingCartIcon />}
                                    onClick={() => handleAddToInvoice(item)}
                                >
                                    Add to Invoice
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CompanyPage;
