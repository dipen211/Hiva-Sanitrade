import React, { useEffect, useState } from 'react';
import { Button, IconButton, Box, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, CircularProgress, Modal, Typography, Button as MuiButton } from '@mui/material';
import { RemoveRedEye as EyeIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CompanyList.css';

const CompanyList = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products');
        setCompanies(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleAddCompany = () => {
    navigate('/add-company');
  };


  const handleDeleteClick = (companyId) => {
    setCompanyToDelete(companyId);
    setOpenDeleteModal(true);
  };


  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setCompanyToDelete(null);
  };


  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/products/${companyToDelete}`);

      setCompanies(companies.filter(company => company._id !== companyToDelete));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting company:', error);
      handleCloseDeleteModal();
    }
  };
  const handleEditClick = (company) => {
    navigate('/add-company', { state: { company } });
  };

  
  const handleViewClick = (company) => {
    navigate('/company', { state: { company } });
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCompany}
        sx={{ marginBottom: 2 }}
      >
        Add Company
      </Button>

      <Table sx={{ minWidth: 650 }} aria-label="company table">
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : (
            companies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((company) => (
                <TableRow key={company._id}>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{company.items && company.items.length}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleViewClick(company)} color="primary">
                      <EyeIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEditClick(company)} color="success" sx={{ marginLeft: '8px' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      sx={{ marginLeft: '8px' }}
                      onClick={() => handleDeleteClick(company._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={companies.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 3,
            borderRadius: 2,
            width: 300,
            textAlign: 'center',
          }}
        >
          <Typography id="modal-title" variant="h6" sx={{ marginBottom: 2 }}>
            Are you sure you want to delete this company?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <MuiButton onClick={handleCloseDeleteModal} color="primary">
              Cancel
            </MuiButton>
            <MuiButton onClick={handleConfirmDelete} color="error">
              Confirm Delete
            </MuiButton>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CompanyList;
