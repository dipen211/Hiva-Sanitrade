import React, { useCallback, useEffect, useState } from "react";
import { Grid, Box, Typography, Card, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, IconButton } from "@mui/material";
import { useParams } from "react-router-dom";
import { Close as CloseIcon, GetApp as DownloadIcon } from "@mui/icons-material";
import html2pdf from "html2pdf.js";  // Import html2pdf.js
import './InvoiceDetails.css';
import apiService from "../../ApiService";

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
        discountRate: "",
        discountAmmount: "0.00",
        createdDate: '',
        items: []
    });

    const [openImageModal, setOpenImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setOpenImageModal(true);
    };

    const handleCloseImageModal = () => {
        setOpenImageModal(false);
    };

    const handleCalculateTotal = useCallback(() => {
        let subTotal = 0;

        config.items.forEach((item) => {
            subTotal = (
                parseFloat(subTotal) +
                parseFloat(item.price) * parseInt(item.quantity)
            ).toFixed(2);
        });

        const subTotalValue = parseFloat(subTotal).toFixed(2);

        const discountAmmountValue = (
            parseFloat(subTotal) *
            (config.discountRate / 100)
        ).toFixed(2);
        const totalValue =
            parseFloat(subTotal) - parseFloat(discountAmmountValue);

        setConfig({
            ...config,
            subTotal: subTotalValue,
            discountAmmount: discountAmmountValue,
            total: totalValue.toFixed(2),
        });
    }, [config]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    async function fetchData() {
        try {
            const response = await apiService.get(`invoice/${id}`);
            setConfig({
                ...config,
                items: response.items,
                billTo: response.billTo,
                discountRate: response.discountRate,
                toMobile: response.toMobile,
                createdDate: formatDate(response.createdAt),
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
    }, [config.items, config.discountRate]);

    const handleDownloadPDF = () => {
        const element = document.getElementById("invoice-content");

        const options = {
            margin: 10,
            filename: "invoice.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2, // Higher scale ensures better quality for images
                logging: true,
                useCORS: true, // Ensure cross-origin images are handled
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf()
            .from(element)
            .set(options)
            .save();
    };


    return (
        <Box id='invoice-content'>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card className="invoice-card">
                        <Box className="invoice-header">
                            <Typography variant="h6" color="textPrimary">
                                Invoice
                            </Typography>
                            <Typography variant="body2" color="textSecondary" className="invoice-created-date">
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
                        <Box className="table-container">
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
                                                    <img
                                                        src={item.image}
                                                        alt={item.productName}
                                                        className="table-img"
                                                        onClick={() => handleImageClick(item.image)}
                                                    />
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
                                    <Box className="subtotal-row">
                                        <Typography variant="body1">Subtotal:</Typography>
                                        <Typography variant="body1">
                                            {config.currency} {config.subTotal}
                                        </Typography>
                                    </Box>
                                    <Box className="subtotal-row">
                                        <Typography variant="body1">Discount({config.discountRate}%):</Typography>
                                        <Typography variant="body1">
                                            {config.currency} {config.discountAmmount}
                                        </Typography>
                                    </Box>
                                    <Divider />
                                    <Box className="total-row">
                                        <Typography variant="h6">Total:</Typography>
                                        <Typography variant="h6">
                                            {config.currency} {config.total}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box className="notes">
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

            {/* Modal to view the image */}
            <Modal
                open={openImageModal}
                onClose={handleCloseImageModal}
                className="modal-container"
            >
                <Box className="modal-box">
                    {/* Close Icon */}
                    <IconButton
                        onClick={handleCloseImageModal}
                        className="close-button"
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Image */}
                    <img
                        src={selectedImage}
                        alt="Product"
                        className="modal-image"
                    />
                </Box>
            </Modal>

            <IconButton
                onClick={handleDownloadPDF}
                className="download-button"
            >
                <DownloadIcon />
            </IconButton>
        </Box>
    );
};

export default InvoiceDetails;
