

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { handleRetry, todaySales } from 'utils/api';
import MainCard from "../../../ui-component/cards/MainCard";
import InternalServerError from 'ui-component/InternalServerError';
import { useState } from 'react';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
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
        background: theme.palette.secondary[800],
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

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const TotalSalesCard = ({ isLoading }) => {
    const theme = useTheme();
    const [error, setError] = useState(false);

    if (error) {
        return <InternalServerError onRetry={handleRetry} />; // Show error page if error occurred
    }

    return (
        <>
            {isLoading ? (
                <InternalServerError onRetry={handleRetry} />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            {/* First Row */}
                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px', margin: '5px' }}>
                                <ShoppingCartCheckoutIcon style={{ fontSize: '50px' }} />
                                <Typography variant="body1" style={{ marginLeft: 10, zIndex: 10 }}>
                                    Total Sales
                                </Typography>
                            </div>

                            {/* Second Row */}

                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, padding: '5px', margin: '5px' }}>
                                <Typography variant="body1" style={{ marginLeft: 10, zIndex: 10, fontSize: '20px' }}>
                                    5
                                </Typography>
                            </div>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

// EarningCard.propTypes = {
//     isLoading: PropTypes.bool
// };

export default TotalSalesCard;