import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import { fetchMedicine, handleRetry } from "utils/api";
import InternalServerError from "ui-component/InternalServerError";

const MedicineCard = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetchMedicine();

    const transformedData = response?.data?.data
      ?.map((item) => ({
        id: item.id,
        medicineName: item.product_name || 0,
        genericName: item.generic_name || 0,
        company: item.supplier_name || 0,
        strength: item.strength || 0,
        QtyAvailable: item.instock || 0,
        expDate: item.expire_date || 0,
        image: item.image || "",
      }))
      //1.) short quantity
      .filter((item) => item.QtyAvailable < 100);
    setData(transformedData);

    //2.)soon expire
    const currentDate = new Date();
    const cutoffDate = new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days from now

    const filteredData = transformedData.filter((item) => {
      const expirationDate = new Date(item.expDate);
      return expirationDate > currentDate && expirationDate <= cutoffDate;
    });

    setData2(filteredData);

    //3.) top sale
    transformedData.sort((a, b) => b.saleCount - a.saleCount);
    const top10Medicines = transformedData.slice(0, 10);

    setData3(top10Medicines);
    } catch (error) {
      console.log("Error : ", error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rows = data;

  if (error) {
    return <InternalServerError onRetry={handleRetry} />; // Show error page if error occurred
  }

  return (
    <>
      {/* <Grid>Medicin cards</Grid> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card style={{ minHeight: "400px" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                <h6 className="text-primary fw-20">Top Sale</h6>
                <hr className="text-primary" />
              </Typography>
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
                    {data3.map((item, index) => (
                      <>
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar alt="logo" src={item.image} width="100px" />
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
        <Grid item xs={12} sm={4}>
          <Card style={{ minHeight: "400px" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                <h6 className="text-primary fw-20">
                  Soon Expiring Medicine List
                </h6>
                <hr className="text-primary" />
              </Typography>
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
                    {data2.map((item, index) => (
                      <>
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar alt="logo" src={item.image} width="100px" />
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
                            <Avatar alt="logo" src={item.image} width="100px" />
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
      </Grid>
    </>
  );
};

export default MedicineCard;
