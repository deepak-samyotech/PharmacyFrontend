import React, {useState,useEffect} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import TotalGrowthBarChart from 'ui-component/cards/Skeleton/EarningCard';
import MainCard from 'ui-component/cards/MainCard';
import { styled, useTheme } from '@mui/material/styles';
import GroupIcon from '@mui/icons-material/Group';
import { PiUsersThreeFill } from "react-icons/pi";
import axios from "axios";
import { fetchCustomer, handleRetry } from 'utils/api';
import InternalServerError from 'ui-component/InternalServerError';


const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));


const TotalOrderLineChartCard = ({ isLoading, totalAdmin }) => {

  const [count, setCount] = useState('');
  const [error, setError] = useState(false);

if (error) {
  return <InternalServerError onRetry={handleRetry} />; // Show error page if error occurred
}

  return (
    <>
      {isLoading ? (
        <TotalGrowthBarChart />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              {/* First Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  margin: "5px",
                }}
              >
                <PiUsersThreeFill style={{ fontSize: '50px' }} />
                <Typography
                  variant="body1"
                  style={{ marginLeft: 10, zIndex: 10 }}
                >
                  Total Company
                </Typography>
              </div>

              {/* Second Row */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 10,
                  padding: "5px",
                  margin: "5px",
                }}
              >
                <Typography
                  variant="body1"
                  style={{ marginLeft: 10, zIndex: 10, fontSize: "20px" }}
                >
                  {totalAdmin}
                </Typography>
              </div>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

export default TotalOrderLineChartCard;