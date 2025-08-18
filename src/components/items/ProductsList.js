import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Button, TextField, Pagination, FormControl, InputLabel, Select, MenuItem, CircularProgress, InputAdornment } from "@mui/material";
import { AddShoppingCart as AddShoppingCartIcon, Search as SearchIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import apiService from "../../ApiService";
import "./ProductsList.css";
import { GeneralContext } from "../../context/GeneralContext";

const ProductList = () => {
    const { cartCount, setCartCount } = useContext(GeneralContext);

    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const itemList = []
            const response = await apiService.get("products");
            response.map((product) => {
                const updatedItemsList = product.items.map((item) => {
                    item.companyName = product.name
                    return item;
                })
                itemList.push(...updatedItemsList)
                return updatedItemsList
            })
            setProducts(itemList);
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error("Error fetching products:", error);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const data = {
                companyName: product.companyName,
                productName: product.name,
                price: product.price,
                quantity: 1,
                image: product.image,
            };
            await apiService.post("cart", data);
            setCartCount(cartCount + 1);
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
        setPage(1);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const startIndex = (page - 1) * itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    if (loading) {
        return (
            <Box className="loading-container">
                <CircularProgress size={60} className="loading-spinner" />
                <Typography variant="h6" className="loading-text">
                    Loading amazing products...
                </Typography>
            </Box>
        );
    }
    return (
        <Box className="product-list-container">
            {/* Page Header */}
            <Box className="products-header">
                <Box>
                    <Typography variant="h2" className="products-title">
                        Our Products
                    </Typography>
                    <Typography className="products-subtitle">
                        Discover amazing products from our partners
                    </Typography>
                </Box>
            </Box>

            {/* Stats Section */}
            <Box className="stats-section">
                <Box className="stats-card">
                    <Typography className="stats-value">{products.length}</Typography>
                    <Typography className="stats-label">Total Products</Typography>
                </Box>
                <Box className="stats-card">
                    <Typography className="stats-value">{filteredProducts.length}</Typography>
                    <Typography className="stats-label">Available</Typography>
                </Box>
                <Box className="stats-card">
                    <Typography className="stats-value">{new Set(products.map(p => p.companyName)).size}</Typography>
                    <Typography className="stats-label">Companies</Typography>
                </Box>
                <Box className="stats-card">
                    <Typography className="stats-value">{cartCount}</Typography>
                    <Typography className="stats-label">In Cart</Typography>
                </Box>
            </Box>

            {/* Search and Filter Section */}
            <Box className="search-filter-section">
                <Box className="search-container">
                    <TextField
                        fullWidth
                        label="Search products..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                <Box className="filter-controls">
                    <FormControl size="small" className="page-size-control">
                        <InputLabel>Show</InputLabel>
                        <Select value={itemsPerPage} onChange={handleItemsPerPageChange} label="Show">
                            <MenuItem value={10}>10 items</MenuItem>
                            <MenuItem value={20}>20 items</MenuItem>
                            <MenuItem value={50}>50 items</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {/* Products Grid */}
            {currentProducts.length > 0 ? (
                <Grid container spacing={3} className="products-grid">
                    {currentProducts.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                            <Card className="product-card">
                                <CardMedia
                                    component="img"
                                    image={product.image || 'https://via.placeholder.com/300x240?text=No+Image'}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <CardContent>
                                    <Box className="product-info">
                                        <Typography variant="body2" className="company-name">
                                            {product.companyName}
                                        </Typography>
                                        <Typography variant="h6" className="product-name">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="h5" className="product-price">
                                            ₹{product.price.toFixed(2)}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<AddShoppingCartIcon />}
                                        onClick={() => handleAddToCart(product)}
                                        className="add-to-cart-btn"
                                    >
                                        Add to Cart
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box className="empty-state">
                    <InventoryIcon className="empty-state-icon" />
                    <Typography variant="h5" className="empty-state-title">
                        No products found
                    </Typography>
                    <Typography variant="body1" className="empty-state-description">
                        Try adjusting your search criteria or check back later for new products.
                    </Typography>
                </Box>
            )}

            {/* Pagination */}
            {filteredProducts.length > itemsPerPage && (
                <Box className="pagination-container">
                    <Pagination
                        count={Math.ceil(filteredProducts.length / itemsPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                    />
                </Box>
            )}
        </Box>
    );
};

export default ProductList;