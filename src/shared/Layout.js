import React, { useEffect, useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, Container, Badge } from "@mui/material";
import { Menu as MenuIcon, ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Layout = (props) => {
    const navigate = useNavigate();
    const [cartItemCount, setCartItemCount] = useState(0);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/cart');
            setCartItemCount(response.data.length);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartItemCount(0);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const handleCart = () => {
        navigate('/invoice');
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="sticky">
                    <Toolbar className='d-flex'>
                        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>

                        <Typography  variant="h6" sx={{ flexGrow: 1 }}>
                            <Link to="/" className='d-flex' style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img src="/images/hiva-logo.png" alt="Logo" style={{ height: 40, marginRight: 8, alignItems: 'center' }} />
                                <span style={{ fontSize: '25px' }}>HIVA</span>
                            </Link>
                        </Typography>

                        <IconButton color="inherit" onClick={() => handleCart()}>
                            <Badge badgeContent={cartItemCount} color="error">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </Box>

            <Container className="mt-2">{props.children}</Container>
        </>
    );
};

export default Layout;
