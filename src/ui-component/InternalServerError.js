import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const InternalServerError = ({ onRetry }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh" // Full screen height
      sx={{ bgcolor: '#f8d7da', p: 4 }} // Light red background color
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: '#721c24' }} />
      
      <Typography variant="h3" color="error" gutterBottom>
        500
      </Typography>
      
      <Typography variant="h5" color="textSecondary" gutterBottom>
        Internal Server Error
      </Typography>

      <Typography variant="body1" color="textSecondary" gutterBottom>
        Oops! Something went wrong on our end. Please try again later.
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        onClick={onRetry}
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    </Box>
  );
};

export default InternalServerError;
