import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Card, CardContent, CardMedia, Button, TextField, Pagination, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { AddShoppingCart as AddShoppingCartIcon } from "@mui/icons-material";
import apiService from "../../ApiService";
import "./ProductsList.css";

const ProductList = () => {
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
        return <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <CircularProgress />
        </Box>;
    }
    return (
        <Box className="product-list-container">
            <TextField
                fullWidth
                label="Search Products by Name"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ marginBottom: 3 }}
            />

            <Box sx={{ marginBottom: 3 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Page Size</InputLabel>
                    <Select value={itemsPerPage} onChange={handleItemsPerPageChange} label="Page Size">
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {currentProducts.length > 0 && currentProducts.map((product) =>
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                        <Card className="product-card">
                            <CardMedia
                                component="img"
                                height="200"
                                image={product.image}
                                alt={product.name}
                                className="product-image"
                            />
                            <CardContent>
                                <Box className="product-info">
                                    <Typography variant="h6" className="product-name">
                                        {product.companyName} - {product.name}
                                    </Typography>
                                    <Typography variant="body1" className="product-price">
                                        ₹{product.price.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<AddShoppingCartIcon />}
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Pagination
                    count={Math.ceil(filteredProducts.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default ProductList;
