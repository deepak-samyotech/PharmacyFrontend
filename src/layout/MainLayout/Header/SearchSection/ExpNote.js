import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Badge from "@mui/material/Badge";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";

function ExpNote() {
  const [anchorEl, setAnchorEl] = useState("");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [data, setData] = useState([]);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/medicine");

        console.log("response.data213131312", response.data);

        const transformedData = response.data?.data?.map((item) => ({
          id: item.id,
          medicineName: item.product_name || 0,
          genericName: item.generic_name || 0,
          company: item.supplier_name || 0,
          strength: item.strength || 0,
          QtyAvailable: item.instock || 0,
          expDate: item.expire_date || 0,
        }));

        // Filter out the items whose expiry date has passed the current date
        const currentDate = new Date();
        const filteredData = transformedData.filter(
          (item) => new Date(item.expDate) < currentDate
        );

        setData(filteredData);
        setRenderCount(filteredData.length);

        console.log("response data----------->", filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  console.log("set===-->", data);
  const rows = data;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            className="notify"
          >
            <Badge
              className="heartbit"
              badgeContent={renderCount}
              color="secondary"
            >
              <ChatBubbleOutlineIcon color="action" />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        style={{ minHeight: 200 }}
      >
        <MenuItem onClick={handleClose}>
          <Grid item xs={12} sm={4}>
            <Card style={{ minHeight: "400px" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  <h6 className="text-primary fw-20">Short Medicine List</h6>
                </Typography>
                <hr className="text-primary" />
                <Typography color="text.secondary">
                  <div>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "background.paper",
                      }}
                    >
                      {/* <ListItem> */}
                      {data.map((item, index) => (
                        <>
                          <ListItem key={index}>
                            <ListItemAvatar>
                              <Avatar
                                alt="logo"
                                src={item.image}
                                width="100px"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <React.Fragment>
                                  <Typography
                                    component="span"
                                    variant="subtitle1"
                                    color="textPrimary"
                                  >
                                    Medicine Name : {item.medicineName}
                                  </Typography>
                                  <br />
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="textSecondary"
                                    //   style={{ marginLeft: "10px" }}
                                  >
                                    Generic Name : {item.genericName}
                                  </Typography>
                                </React.Fragment>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    Expiry Date: {item.expDate}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                        </>
                      ))}
                      {/* </ListItem> */}
                    </List>
                  </div>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </MenuItem>
        <Divider />
      </Menu>
    </>
  );
}

export default ExpNote;
