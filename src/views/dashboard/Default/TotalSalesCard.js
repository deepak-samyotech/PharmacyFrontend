import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import EarningCard from './EarningCard';
import { handleRetry, todaySales } from 'utils/api';
import { HttpStatusCodes } from 'utils/statusCodes';
import InternalServerError from 'ui-component/InternalServerError';

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

    const [count, setCount] = useState(0);
    const [error, setError] = useState(false); 

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchTodaySale = async() => {
        try {
            const response = await todaySales();

        if (response.status === HttpStatusCodes.OK) {
            setCount(response?.data?.data?.length);
        }
        } catch (error) {
            console.log("Error : ", error);
            setError(true);
        }
    }

    useEffect(() => {
        fetchTodaySale();
    }, [])

    if (error) {
        return <InternalServerError onRetry={handleRetry} />; // Show error page if error occurred
      }

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            {/* First Row */}
                            <div style={{ display: 'flex', alignItems: 'center', padding: '5px', margin: '5px' }}>
                                <ShoppingCartCheckoutIcon style={{ fontSize: '50px' }} />
                                <Typography variant="body1" style={{ marginLeft: 10, zIndex: 10 }}>
                                    Sales Today
                                </Typography>
                                {/* <Typography variant="body1" style={{ marginLeft: 'auto', zIndex: 10 }}>
                  1
                </Typography> */}
                            </div>

                            {/* Second Row */}

                            <div style={{ display: 'flex', alignItems: 'center', marginTop: 10, padding: '5px', margin: '5px' }}>
                                <Typography variant="body1" style={{ marginLeft: 10, zIndex: 10, fontSize: '20px' }}>
                                   {count }
                                </Typography>
                                {/* <Typography variant="body1" style={{ marginLeft: 'auto', zIndex: 10 }}>
                2
              </Typography> */}
                            </div>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalSalesCard;