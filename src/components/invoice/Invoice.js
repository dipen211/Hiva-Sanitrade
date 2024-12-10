import React, { useCallback, useEffect, useState } from "react";
import { Grid, Box, Typography, Button, TextField, InputAdornment, Card, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from "axios";

const Invoice = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [config, setConfig] = useState({
        isOpen: false,
        currency: "₹",
        currentDate: new Date().toLocaleDateString(),
        invoiceNumber: 1,
        dateOfIssue: "",
        billTo: "",
        billToEmail: "",
        toMobile: "",
        billFrom: "Keval Shah",
        billFromEmail: "keval.shah@gmail.com",
        fromMobile: "+91-8140210375",
        total: "0.00",
        subTotal: "0.00",
        taxRate: "",
        taxAmmount: "0.00",
        discountRate: "",
        discountAmmount: "0.00",
    });

    const [items, setItems] = useState([]);

    const handleCalculateTotal = useCallback(() => {
        let subTotal = 0;

        items.forEach((item) => {
            subTotal = (
                parseFloat(subTotal) +
                parseFloat(item.price) * parseInt(item.quantity)
            ).toFixed(2);
        });

        const subTotalValue = parseFloat(subTotal).toFixed(2);
        const taxAmmountValue = (
            parseFloat(subTotal) *
            (config.taxRate / 100)
        ).toFixed(2);
        const discountAmmountValue = (
            parseFloat(subTotal) *
            (config.discountRate / 100)
        ).toFixed(2);
        const totalValue =
            parseFloat(subTotal) - parseFloat(discountAmmountValue) + parseFloat(taxAmmountValue);

        setConfig({
            ...config,
            subTotal: subTotalValue,
            taxAmmount: taxAmmountValue,
            discountAmmount: discountAmmountValue,
            total: totalValue.toFixed(2),
        });
    }, [config, items]);

    async function fetchData() {
        try {
            const response = await axios.get('http://localhost:3001/api/cart');
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        handleCalculateTotal();
    }, [items, config.taxRate, config.discountRate]);

    async function handleRowDel(item) {
        try {
            const response = await axios.delete(`http://localhost:3001/api/cart/${item._id}`);
            console.log(response.data);
        } catch (error) {
            console.error("Error deleting cart item:", error);
        }
        await fetchData();
        handleCalculateTotal();
    }
    const validateFields = () => {
        const validationErrors = {};
        if (!config.billTo.trim()) validationErrors.billTo = "Name is required.";
        if (!config.toMobile.trim())
            validationErrors.toMobile = "Phone number is required.";
        else if (!/^\d{10}$/.test(config.toMobile))
            validationErrors.toMobile = "Phone number must be 10 digits.";

        if (config.taxRate === "" || isNaN(config.taxRate) || config.taxRate < 0 || config.taxRate > 100)
            validationErrors.taxRate = "Tax rate must be a number between 0 and 100.";

        if (config.discountRate === "" || isNaN(config.discountRate) || config.discountRate < 0 || config.discountRate > 100)
            validationErrors.discountRate = "Discount rate must be a number between 0 and 100.";
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const sendInvoice = async (event) => {
        if (!validateFields()) {
            console.log(errors)
            return
        }
        const invoiceData = {
            items: items,
            taxRate: config.taxRate,
            discountRate: config.discountRate,
            billTo: config.billTo,
            toMobile: config.toMobile,
        };
        await fetch('http://localhost:3001/api/invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData),
        })
            .then(res => res.json())
            .then(json => {
                try {
                    axios.delete(`http://localhost:3001/api/cart`);
                } catch (error) { }
                const url = `${window.location.origin}/invoice/your-invoice/${json._id}`
                const shareUrl = `https://api.whatsapp.com/send?phone=918140210375&text=${url}`;
                window.open(shareUrl, "_blank");
            }).catch((e) => { })
    };

    const handleIncrementQuantity = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item._id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const handleDecrementQuantity = (id) => {
        setItems((prev) =>
            prev.map((item) =>
                item._id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };
    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                {/* Left Column: Invoice Details */}
                <Grid item xs={12} md={8} lg={9}>
                    <Card sx={{ padding: 3 }}>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h6" color="textPrimary">
                                Invoice
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {config.currentDate}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box mt={2}>
                            <Grid container spacing={3}>
                                {/* Bill From */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Bill From"
                                        fullWidth
                                        value="Keval Shah"
                                        disabled
                                    />
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        value="keval.shah@gmail.com"
                                        disabled
                                        sx={{ mt: 2 }}
                                    />
                                    <TextField
                                        label="Mobile"
                                        fullWidth
                                        value="+91-8140210375"
                                        disabled
                                        sx={{ mt: 2 }}
                                    />
                                </Grid>

                                {/* Bill To */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Bill To"
                                        name={'billTo'}
                                        id={'billTo'}
                                        error={!!(errors && errors.billTo)}
                                        helperText={errors && errors.billTo}
                                        fullWidth
                                        value={config.billTo}
                                        onChange={(e) => setConfig({ ...config, billTo: e.target.value })}
                                        required
                                    />
                                    <TextField
                                        label="Mobile"
                                        name={'toMobile'}
                                        id={'toMobile'}
                                        error={!!(errors && errors.toMobile)}
                                        helperText={errors && errors.toMobile}
                                        fullWidth
                                        value={config.toMobile}
                                        onChange={(e) => setConfig({ ...config, toMobile: e.target.value })}
                                        required
                                        sx={{ mt: 2 }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Table for displaying items */}
                        <Box mt={4}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item ID</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    {item.companyName} {item.productName}
                                                </TableCell>
                                                <TableCell>{item.price} ₹</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleDecrementQuantity(item._id)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </Button>
                                                        <Typography variant="body1" sx={{ marginX: 1 }}>
                                                            {item.quantity}
                                                        </Typography>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => handleIncrementQuantity(item._id)}
                                                        >
                                                            +
                                                        </Button>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <img src={item.image} alt={item.productName} width={50} />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        color="error"
                                                        sx={{ marginLeft: '8px' }}
                                                        onClick={() => handleRowDel(item)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Totals */}
                        <Box mt={4}>
                            <Grid container justifyContent="flex-end">
                                <Grid item xs={12} md={6}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1">Subtotal:</Typography>
                                        <Typography variant="body1">
                                            {config.currency} {config.subTotal}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1">Discount:</Typography>
                                        <Typography variant="body1">
                                            {config.currency} {config.discountAmmount}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1">Tax:</Typography>
                                        <Typography variant="body1">
                                            {config.currency} {config.taxAmmount}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Typography variant="h6">Total:</Typography>
                                        <Typography variant="h6">
                                            {config.currency} {config.total}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box mt={3}>
                            <TextField
                                label="Notes"
                                fullWidth
                                multiline
                                rows={2}
                                value="Thank you for doing business with us!"
                                disabled
                            />
                        </Box>
                    </Card>
                </Grid>

                {/* Right Column: Actions */}
                <Grid item xs={12} md={4} lg={3}>
                    <Box position="sticky" top={20}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            onClick={() => navigate("/item")}
                            sx={{ mb: 2 }}
                        >
                            Back To List
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="error"
                            sx={{ mb: 2 }}
                        >
                            Clear All Items
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={sendInvoice}
                        >
                            Send Invoice
                        </Button>
                        <TextField
                            label="Tax Rate"
                            name={'taxRate'}
                            id={'taxRate'}
                            error={!!(errors && errors.taxRate)}
                            helperText={errors && errors.taxRate}
                            fullWidth
                            type="number"
                            value={config.taxRate}
                            onChange={(e) => setConfig({ ...config, taxRate: e.target.value })}
                            sx={{ mt: 3 }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Discount Rate"
                            fullWidth
                            name={'discountRate'}
                            id={'discountRate'}
                            error={!!(errors && errors.discountRate)}
                            helperText={errors && errors.discountRate}
                            type="number"
                            value={config.discountRate}
                            onChange={(e) => setConfig({ ...config, discountRate: e.target.value })}
                            sx={{ mt: 2 }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Invoice;
