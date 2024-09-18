import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from "@mui/material";

// project imports
import MainCard from "../../../ui-component/cards/MainCard";
import SkeletonEarningCard from "ui-component/cards/Skeleton/EarningCard";

// assets
import InventoryIcon from "@mui/icons-material/Inventory";

import { fetchSupplier, handleRetry } from "utils/api";
import InternalServerError from "ui-component/InternalServerError";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: "#fff",
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: "50%",
    top: -85,
    right: -95,
    [theme.breakpoints.down("sm")]: {
      top: -105,
      right: -140,
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: "50%",
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down("sm")]: {
      top: -155,
      right: -70,
    },
  },
}));
// ===========================|| DASHBOARD DEFAULT - Supplier CARD ||=========================== //

const TotalSupplierCard = ({ isLoading, totalActiveAdmin }) => {
  const [countSup, setCountSup] = useState("");
  const [error, setError] = useState(false);

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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  margin: "5px",
                }}
              >
                <InventoryIcon style={{ fontSize: "50px" }} />
                <Typography
                  variant="body1"
                  style={{ marginLeft: 10, zIndex: 10 }}
                >
                  Total Active Company
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
                  {totalActiveAdmin}
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
//   isLoading: PropTypes.bool,
// };

export default TotalSupplierCard;
