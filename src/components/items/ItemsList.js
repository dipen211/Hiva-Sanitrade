import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Card, CardContent, CardMedia, MenuItem, Select, FormControl, InputLabel, TextField, CircularProgress } from '@mui/material';
import { AddCircle as AddCircleIcon, AddShoppingCart as AddShoppingCartIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../../ApiService';
import { Pagination } from '@mui/material';

const CompanyPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [companyData, setCompanyData] = useState(null);
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchCompanyData = async () => {
        setLoading(true);
        try {
            const response = await apiService.get(`products/${id}`);
            setCompanyData(response);
            setProducts(response.items);
        } catch (error) {
            console.error('Error fetching company data:', error);
            alert('Failed to fetch company data');
        } finally {
            setLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // Handle page size change
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1); // Reset to the first page when page size changes
    };

    // Handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to the first page when search query changes
    };

    // Filter products based on search query
    const filterProducts = (products) => {
        if (!searchQuery) return products;
        return products.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Handle add to invoice
    const handleAddToInvoice = async (item) => {
        try {
            const data = {
                companyName: companyData.name,
                productName: item.name,
                price: item.price,
                quantity: 1,
                image: item.image,
            };
            await apiService.post("cart", data);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    // Handle delete item
    const handleDeleteItem = async (itemId) => {
        try {
            await apiService.delete(`products/${companyData._id}/item/${itemId}`);
            setProducts(products.filter((item) => item._id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    };

    useEffect(() => {
        fetchCompanyData();
    }, [id]);

    useEffect(() => {
        const filteredProducts = filterProducts(products);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
    }, [products, currentPage, pageSize, searchQuery]);

    if (loading) {
        return <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <CircularProgress />
        </Box>;
    }

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
                    onClick={() => navigate('/add-company', { state: { company: companyData } })}
                >
                    Add Items
                </Button>
            </Box>

            {/* Search Field */}
            <Box sx={{ marginBottom: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search Products"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </Box>

            {/* Page Size Selector */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Page Size</InputLabel>
                    <Select value={pageSize} onChange={handlePageSizeChange} label="Page Size">
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Product Cards */}
            <Grid container spacing={3}>
                {displayedProducts.map((item) => (
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
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        startIcon={<AddShoppingCartIcon />}
                                        onClick={() => handleAddToInvoice(item)}
                                    >
                                        Add to Invoice
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        fullWidth
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeleteItem(item._id)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Pagination
                    count={Math.ceil(filterProducts(products).length / pageSize)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default CompanyPage;
