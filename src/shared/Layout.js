import React, { useEffect, useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, Container, Badge } from "@mui/material";
import { ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Layout = (props) => {
    const navigate = useNavigate();
    const [cartItemCount, setCartItemCount] = useState(0);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get('https://billingservice-wq93.onrender.com/api/cart');
            setCartItemCount(response.data.length);
        } catch (error) {
            console.error("Error fetching cart items:", error);
            setCartItemCount(0);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="sticky">
                    <Toolbar className='d-flex'>
                        <Typography className="d-flex" variant="h6" sx={{ flexGrow: 1 }} onClick={()=>navigate('/')}>
                                <img src="/images/hiva.png" alt="Logo" style={{ height: 40, marginRight: 8, alignItems: 'center' }} />
                                <span style={{ fontSize: '25px' }}>HIVA</span>
                        </Typography>

                        <IconButton color="inherit" onClick={() => navigate('/invoice')}>
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
