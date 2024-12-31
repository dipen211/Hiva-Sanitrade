import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Modal,
  Grid,
} from '@mui/material';
import { RemoveRedEye as EyeIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import apiService from '../../ApiService';

const CompanyList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await apiService.get("products");
        setCompanies(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

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
      await apiService.delete(`products/${companyToDelete}`);
      setCompanies(companies.filter(company => company._id !== companyToDelete));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting company:', error);
      handleCloseDeleteModal();
    }
  };

  const handleEditClick = (company) => {
    navigate(`/add-company`, { state: { company } });
  };

  const handleViewClick = (company) => {
    navigate(`/company/${company._id}`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCompany}
        sx={{
          marginBottom: 2,
          width: isMobile ? '100%' : 'auto',
        }}
      >
        Add Company
      </Button>

      {loading ? (
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {companies.map((company) => (
            <Grid item xs={12} sm={6} md={4} key={company._id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {company.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Items: {company.items && company.items.length}
                  </Typography>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto', justifyContent: 'space-between' }}>
                  <IconButton onClick={() => handleViewClick(company)} color="primary">
                    <EyeIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditClick(company)} color="success">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(company._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
            width: isMobile ? '90%' : 300,
            textAlign: 'center',
          }}
        >
          <Typography id="modal-title" variant="h6" sx={{ marginBottom: 2 }}>
            Are you sure you want to delete this company?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={handleCloseDeleteModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error">
              Confirm Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CompanyList;
