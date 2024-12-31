import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import apiService from "../../ApiService";

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    const fetchInvoices = async () => {
        try {
            const response = await apiService.get("invoice");
            setInvoices(response);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };

    const handleOpenDialog = (invoiceId) => {
        setInvoiceToDelete(invoiceId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInvoiceToDelete(null);
    };

    const handleDeleteInvoice = async () => {
        try {
            if (invoiceToDelete) {
                await apiService.delete(`invoice/${invoiceToDelete}`);
                fetchInvoices();
            }
            handleCloseDialog();
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Invoice List
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Created Date</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.billTo}</TableCell>
                                <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Link to={`/invoice/${invoice._id}`}>
                                        <IconButton color="primary">
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Link>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleOpenDialog(invoice._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this invoice?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteInvoice} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InvoiceList;
