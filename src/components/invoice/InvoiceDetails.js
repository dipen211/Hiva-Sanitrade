import React, { useCallback, useEffect, useState } from "react";
import { Grid, Box, Typography, Card, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const InvoiceDetails = () => {
    const { id } = useParams();
    const [config, setConfig] = useState({
        currency: "₹",
        currentDate: "",
        billTo: "",
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
        createdDate: '',
        items: []
    });

    const handleCalculateTotal = useCallback(() => {
        let subTotal = 0;

        config.items.forEach((item) => {
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
    }, [config]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Adds leading zero if day is less than 10
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    async function fetchData() {
        try {
            console.log(id)
            const response = await axios.get(`https://billingservice-wq93.onrender.com/api/invoice/${id}`);
            setConfig({
                ...config,
                items: response.data.items,
                billTo: response.data.billTo,
                discountRate: response.data.discountRate,
                taxRate: response.data.taxRate,
                toMobile: response.data.toMobile,
                createdDate: formatDate(response.data.createdAt),
            });
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        handleCalculateTotal();
    }, [config.items, config.taxRate, config.discountRate]);

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card sx={{ padding: 3 }}>
                        <Box display="flex" justifyContent="space-between" mb={2}>
                            <Typography variant="h6" color="textPrimary">
                                Invoice
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {config.createdDate}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box mt={2}>
                            <Grid container spacing={3}>
                                {/* Bill From */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>Bill From</strong>
                                    </Typography>
                                    <Typography variant="body1"><b>Name:</b> Keval Shah</Typography>
                                    <Typography variant="body1"><b>Email:</b> keval.shah@gmail.com</Typography>
                                    <Typography variant="body1"><b>Phone:</b> +91-8140210375</Typography>
                                </Grid>

                                {/* Bill To */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        <strong>Bill To</strong>
                                    </Typography>
                                    <Typography variant="body1"><b>Name:</b> {config.billTo}</Typography>
                                    <Typography variant="body1"><b>Phone:</b> {config.toMobile}</Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Table for displaying items */}
                        <Box mt={4}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Image</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {config.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {item.companyName} {item.productName}
                                                </TableCell>
                                                <TableCell>{item.price} ₹</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    <img src={item.image} alt={item.productName} width={50} />
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
                                        <Typography variant="body1">Discount({config.discountRate}%):</Typography>
                                        <Typography variant="body1">
                                            {config.currency} {config.discountAmmount}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography variant="body1">Tax({config.taxRate}%):</Typography>
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
                            <Typography variant="subtitle1" gutterBottom>
                                Notes
                            </Typography>
                            <Typography variant="body2">
                                Thank you for doing business with us!
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default InvoiceDetails;
