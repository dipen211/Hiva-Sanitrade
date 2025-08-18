import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Modal,
  Grid,
  Avatar,
} from '@mui/material';
import { RemoveRedEye as EyeIcon, Edit as EditIcon, Delete as DeleteIcon, Business as BusinessIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiService from '../../ApiService';
import './CompanyList.css';

const CompanyList = () => {
  const navigate = useNavigate();

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
    <Box className="company-list-container">
      {/* Page Header */}
      <Box className="companies-header">
        <Box>
          <Typography variant="h2" className="companies-title">
            Companies
          </Typography>
          <Typography className="companies-subtitle">
            Manage your business partners and suppliers
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleAddCompany}
          startIcon={<AddIcon />}
          className="add-company-btn"
        >
          Add Company
        </Button>
      </Box>

      {loading ? (
        <Box className="loading-container">
          <CircularProgress size={60} className="loading-spinner" />
          <Typography variant="h6" className="loading-text">
            Loading companies...
          </Typography>
        </Box>
      ) : companies.length > 0 ? (
        <Grid container spacing={3} className="companies-grid">
          {companies.map((company) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={company._id}>
              <Card className="company-card">
                <Box className="company-header">
                  <Avatar className="company-avatar">
                    {company.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" className="company-name">
                    {company.name}
                  </Typography>
                  <Typography className="company-items-count">
                    {company.items ? company.items.length : 0} Products
                  </Typography>
                </Box>

                <Box className="company-content">
                  <Box className="company-stats">
                    <Box className="company-stat">
                      <Typography className="company-stat-value">
                        {company.items ? company.items.length : 0}
                      </Typography>
                      <Typography className="company-stat-label">
                        Products
                      </Typography>
                    </Box>
                    <Box className="company-stat">
                      <Typography className="company-stat-value">
                        {company.status || 'Active'}
                      </Typography>
                      <Typography className="company-stat-label">
                        Status
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <CardActions className="company-actions">
                  <IconButton
                    onClick={() => handleViewClick(company)}
                    className="action-btn view-btn"
                    title="View Details"
                  >
                    <EyeIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditClick(company)}
                    className="action-btn edit-btn"
                    title="Edit Company"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(company._id)}
                    className="action-btn delete-btn"
                    title="Delete Company"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box className="empty-state">
          <BusinessIcon className="empty-state-icon" />
          <Typography variant="h5" className="empty-state-title">
            No companies yet
          </Typography>
          <Typography variant="body1" className="empty-state-description">
            Start by adding your first company to manage products and track business relationships.
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddCompany}
            startIcon={<AddIcon />}
            className="add-company-btn"
          >
            Add Your First Company
          </Button>
        </Box>
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
          }}
          className="delete-modal"
        >
          <Typography id="modal-title" variant="h6" className="delete-modal-title">
            Delete Company?
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 3, color: '#64748b' }}>
            This action cannot be undone. All products associated with this company will also be removed.
          </Typography>
          <Box className="delete-modal-actions">
            <Button
              onClick={handleCloseDeleteModal}
              className="modal-btn cancel-btn"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="modal-btn confirm-btn"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CompanyList;
