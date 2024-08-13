import React from 'react';
import Button from '@mui/material/Button';
import AddCardIcon from '@mui/icons-material/AddCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import Grid from '@mui/material/Grid';
import { gridSpacing } from 'store/constant';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';



const buttonStyle = {
  backgroundColor: '#fff',
  color: '#000',
  border: '1px solid #ccc',
  borderRadius: '4px',
  paddingRight: '180px',
  padding: '0px',
  width: '100%',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'start',
  cursor: 'pointer',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#f8f9fa',
  },
};

const iconStyle = {
  marginRight: '8px',
  backgroundColor: '#4682B4',
  color: '#fff',
  padding: '10px', // Adjust padding as needed
  fontSize: '60px', // Increase font size for better visibility
};



const TotalGrowthBarChart = () => {
  const navigate = useNavigate();

  const handleButtonClick1 = () => {
    navigate('/pos-page');
  }

  const handleButtonClick2 = () => {
    navigate('/medicine/manage-medicine');
  };

  const handleButtonClick3 = () => {
    navigate('/purchase/add-purchase');
  };

  const handleButtonClick4 = () => {
    navigate('/supplier/add-supplier');
  };

  const handleButtonClick5 = () => {
    navigate('/customer/add-customer');
  };

  const handleButtonClick6 = () => {
    navigate('/report/today-report');
  };

  const handleButtonClick7 = () => {
    navigate('/purchase/add-purchase');
  };

  const handleButtonClick8 = () => {
    navigate('/inventory/out-of-stock');
  };

  return (
    <>
      <Container style={{ marginBottom: '15px' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Button onClick={handleButtonClick1} style={buttonStyle} startIcon={<ReceiptIcon style={iconStyle} />}>
              Create Invoice
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Button onClick={handleButtonClick2} style={buttonStyle} startIcon={<MedicalServicesIcon style={iconStyle} />}>
              Add Medicine
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Button onClick={handleButtonClick3} style={buttonStyle} startIcon={<ShoppingCartIcon style={iconStyle} />}>
              Add Purchase
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Button onClick={handleButtonClick4} style={buttonStyle} startIcon={<InventoryIcon style={iconStyle} />}>
              Add Supplier
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Button onClick={handleButtonClick5} style={buttonStyle} startIcon={<PersonAddIcon style={iconStyle} />}>
              Add Customer
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Button onClick={handleButtonClick6} style={buttonStyle} startIcon={<DescriptionIcon style={iconStyle} />}>
              Sales Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Button onClick={handleButtonClick7} style={buttonStyle} startIcon={<DescriptionIcon style={iconStyle} />}>
              Purchase Report
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={3}>
            <Button onClick={handleButtonClick8} style={buttonStyle} startIcon={<DisabledByDefaultIcon style={iconStyle} />}>
              Out Of Stock
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default TotalGrowthBarChart;



