import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Modal } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import logo from "../../../../assets/images/logo.svg";
import PrintIcon from "@mui/icons-material/Print";
import Logo from "ui-component/Logo";
const tableContainer = {
  border: "1px solid #e0e0e0",
  borderRadius: "0px",
  //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Adding box shadow
};
const tablediv = {
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow
};
const tableHead = {
  backgroundColor: "#f5f5f5",
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ManageBill({ open, handleClose, handleOpen }) {


  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description">
            <Card sx={tablediv} style={{ backgroundColor: "#ffffff" }}>
              <CardContent>
                <div className="bg-light">
                  <Grid
                    style={{ display: "flex", justifyContent: "center" }}
                    spacing={2}
                  >
                    <Grid item xs={6} md={10} lg={10}>
                    <Logo/>
                    </Grid>
                    {/* <Grid item xs={6} md={2} lg={2}>
                      Wednesday 7th of February 2024 04:37:08 PM
                    </Grid> */}
                  </Grid>
                  <hr />
                  <div style={{ marginBottom: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={6}>
                        INVOICE
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={6}
                        style={{ display: "flex", justifyContent: "end" }}
                      >
                        #356356
                      </Grid>
                    </Grid>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={6}>
                        <Typography variant="h2">Safeway Pharmaaa</Typography>
                        <Typography variant="h6">
                          1st Floor, Pramukh Plaza, Vijay Nagar, Indore
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Grid
                          item
                          xs={6}
                          md={6}
                          style={{ display: "flex", justifyContent: "end" }}
                        >
                          <Typography variant="h5">TO,</Typography>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          md={6}
                          style={{ display: "flex", justifyContent: "end" }}
                        >
                          <p>Divyanshu Jain</p>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          md={6}
                          style={{ display: "flex", justifyContent: "end" }}
                        >
                          <p>lig,</p>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          md={6}
                          style={{ display: "flex", justifyContent: "end" }}
                        >
                          <p>divyanshujain1794@gmail.com</p>
                          <br></br>
                          <p>7000682094</p>
                        </Grid>

                        <Grid
                          item
                          xs={6}
                          md={6}
                          style={{ display: "flex", justifyContent: "end" }}
                        ></Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      justifyContent="center"
                      style={{ marginTop: "30px" }}
                    >
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <TableContainer component={Paper} sx={tableContainer}>
                          <Table>
                            <TableHead sx={tableHead}>
                              <TableRow>
                                <TableCell>Receiver Name</TableCell>
                                <TableCell>Receiver Contact</TableCell>
                                <TableCell>Paid Amount</TableCell>
                                <TableCell>Payment Date</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>Data 1</TableCell>
                                <TableCell>Data 2</TableCell>
                                <TableCell>Data 3</TableCell>
                                <TableCell>Data 4</TableCell>
                              </TableRow>
                              {/* Add more rows as needed */}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                    </Grid>
                    <Grid style={{ marginTop: "30px" }}>
                      <p>Signature</p>
                      <hr />
                    </Grid>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Stack spacing={2} direction="row">
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<PrintIcon />}
                      >
                        Print
                      </Button>
                      <Button onClick={handleClose} variant="outlined">
                        Cancel
                      </Button>
                    </Stack>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default ManageBill;
