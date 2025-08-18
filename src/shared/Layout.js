import React, { useContext, useState } from "react";
import { AppBar, Toolbar, IconButton, Badge, Button, Menu, MenuItem, Container, Typography, Box } from "@mui/material";
import { ShoppingCart as ShoppingCartIcon, Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import "./Layout.css";
import { GeneralContext } from "../context/GeneralContext";

const Layout = (props) => {
    const { logout } = useAuth0();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const { cartCount } = useContext(GeneralContext);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="sticky" className="app-bar">
                    <Toolbar className="toolbar">
                        <Typography
                            variant="h6"
                            className="logo-container"
                            onClick={() => navigate("/")}
                        >
                            <img src="/images/hiva.png" alt="Logo" className="logo" />
                            <span className="logo-text">HIVA</span>
                        </Typography>

                        <Box className="menu-icon-container">
                            <IconButton
                                size="large"
                                color="inherit"
                                onClick={handleMenuOpen}
                                className="menu-icon"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                className="menu"
                            >
                                <MenuItem
                                    onClick={() => {
                                        navigate("/");
                                        handleMenuClose();
                                    }}
                                    className="menu-item"
                                >
                                    Home
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/products");
                                        handleMenuClose();
                                    }}
                                    className="menu-item"
                                >
                                    Items
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        navigate("/invoiceList");
                                        handleMenuClose();
                                    }}
                                    className="menu-item"
                                >
                                    Invoices
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        logout({
                                            logoutParams: { returnTo: window.location.origin },
                                        });
                                        handleMenuClose();
                                    }}
                                    className="menu-item"
                                >
                                    Log Out
                                </MenuItem>
                            </Menu>
                            <IconButton
                                color="inherit"
                                onClick={() => navigate("/invoice")}
                                className="cart-icon"
                            >
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </Box>

                        <Box className="button-container">
                            <Button
                                variant="text"
                                color="inherit"
                                className="nav-button"
                                onClick={() => navigate("/")}
                            >
                                Home
                            </Button>
                            <Button
                                variant="text"
                                color="inherit"
                                className="nav-button"
                                onClick={() => navigate("/products")}
                            >
                                Items
                            </Button>
                            <Button
                                variant="text"
                                color="inherit"
                                className="nav-button"
                                onClick={() => navigate("/invoiceList")}
                            >
                                Invoices
                            </Button>
                            <IconButton
                                color="inherit"
                                onClick={() => navigate("/invoice")}
                                className="cart-icon"
                            >
                                <Badge badgeContent={cartCount} color="error">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                            <Button
                                variant="outlined"
                                color="inherit"
                                className="logout-button"
                                onClick={() =>
                                    logout({
                                        logoutParams: { returnTo: window.location.origin },
                                    })
                                }
                            >
                                Log Out
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <Container className="content-container">
                {props.children}
            </Container>
        </>
    );
};

export default Layout;
