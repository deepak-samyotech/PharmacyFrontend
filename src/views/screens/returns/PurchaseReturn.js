import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { toast } from "react-toastify";

const PurchaseReturn = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [invoice, setInvoice] = useState("");
  const [inDate, setInDate] = useState("");
  const [note, setNote] = useState("");
  const [td, setTd] = useState("");
  const [rQty, setRQty] = useState('');
  const [total, setTotal] = useState('');
  const [mrp, setMrp] = useState(0);
  const [medicine, setMedicine] = useState([]);
  const [purchaseQty, setPurchaseQty] = useState([]);
  const [generic_name, setGeneric_name] = useState("");
  const [form, setForm] = useState("");
  const [trade_price, setTrade_pricel] = useState("");
  const [barcode, setBarcode] = useState("");
  const [errors, setErrors] = useState({});


  const handleSubmit = async () => {
    try {
      const invoiceResponse = await axios.get(
        `http://localhost:8080/purchase-history/search?invoice_no=${searchTerm}`
      );
      const responseData = invoiceResponse.data.PurchaseHistoryData;
      if (responseData.length > 0) {
        setShowFields(true);
        setCompanyName(responseData[0].supplier_name);
        setSupplierId(responseData[0].supplier_id);
        setInvoice(responseData[0].invoice_no);
        setInDate(responseData[0].date);
        setNote(responseData[0].details);
        setMedicine(responseData[0].product_name);
        setPurchaseQty(responseData[0].sale_qty);
        setMrp(responseData[0].mrp);
        setGeneric_name(responseData[0].generic_name);
        setForm(responseData[0].form);
        setTrade_pricel(responseData[0].trade_price);
        setBarcode(responseData[0].barcode);

        setData(responseData);
      } else {
        setShowFields(false);
      }
    } catch (error) {
      console.error("Error searching for invoice:", error);
    }
  };
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBoxPriceCalculation = () => {
    // Calculate box price based on MRP and box size
    const calculatedBoxPrice =
      parseFloat(mrp) * parseInt(rQty) -
      (parseFloat(mrp) * parseInt(rQty) * parseFloat(td || 0)) / 100;
    setTotal(calculatedBoxPrice.toFixed(2)); // Set the box price
  };

  useEffect(() => {
    handleBoxPriceCalculation(); // Call the calculation function whenever MRP or box size changes
  }, [mrp, rQty, td]);

  const handleReturnSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!rQty) newErrors.rQty = 'Return Quantity is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // setIsCalling(false);
      return;
    }

    const formData = new FormData();
    formData.append("sid", supplierId);
    formData.append("supplier_name", companyName);
    formData.append("invoice_no", invoice);
    formData.append("date", inDate);
    formData.append("details", note);
    formData.append("product_name", medicine);
    formData.append("mrp", mrp);
    formData.append("sale_qty", purchaseQty);
    formData.append("trade_price", rQty);
    // formData.append('discount', discountType);
    formData.append("total_amount", total);
    formData.append("generic_name", generic_name);
    formData.append("form", form);
    formData.append("trade_price", trade_price);
    formData.append("barcode", barcode);

    axios
      .post(`http://localhost:8080/purchase_return`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage("Purchase history added successfully.");
          setFailureMessage("");
          toast.success("Return Added successfully.")
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
      .catch((error) => {
        console.error("Error appending barcode number to form data:", error);
        setFailureMessage("Error adding Return. Please try again.");
        console.error("Error adding Return:", error);
        toast.error("Error adding Return. Please try again.")
      });
  };

  const handleReturnQuantity = (e) => {
    const value = parseInt(e.target.value, 10);

    if (value >= 1 && value <= purchaseQty) {
      setRQty(value);
    } else if (value < 1) {
      toast.error("Return quantinty should be grater than 1.")
      setRQty('');
    } else if (value > purchaseQty) {
      toast.error("Return quantity should be less than equal to purchase quantity.")
      setRQty('');
    }
  }

  const handleTdChange = (e) => {
    const value = parseInt(e.target.value, 10);

    if (value >= 1 && value <= 100) {
      setTd(value);
    } else if (value < 1) {
      toast.error("TD should be grater than 0.")
      setTd('');
    } else if (value > 100) {
      toast.error("TD should be less than equal to 100.")
      setTd('');
    }
  }

  return (
    <div style={{ margin: "10px" }}>
      <Card style={{ backgroundColor: "#ffffff" }}>
        <CardContent>
          <div className="bg-light">
            <Grid container spacing={2}>
              <Grid item xs={6} md={10} lg={10}>
                <h3>Purchase Return</h3>
              </Grid>
            </Grid>
            <hr />
            <div>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box
                    component="form"
                    sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
                    noValidate
                    autoComplete="off"
                    display="flex"
                    alignItems="center" // Align items vertically centered
                  >
                    <TextField
                      label="Invoice Number"
                      variant="outlined"
                      value={searchTerm}
                      onChange={handleChange}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      style={{ marginLeft: "10px" }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </div>

            {showFields && (
              <div className="mt-5 m-1">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Company Name "
                      variant="outlined"
                      value={companyName}
                      // onChange={(e) => setCompanyName(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Invoice No"
                      variant="outlined"
                      value={invoice}
                      // onChange={(e) => setInvoice(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Invoice Date"
                      variant="outlined"
                      value={inDate}
                      // onChange={(e) => setInDate(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Note"
                      variant="outlined"
                      value={note}
                      // onChange={(e) => setNote(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <hr />
                <div>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Medicine</TableCell>
                          <TableCell>MRP</TableCell>
                          <TableCell>Purchase Qty</TableCell>
                          <TableCell>Return Qty</TableCell>
                          <TableCell>TD(%)</TableCell>
                          <TableCell>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{medicine}</TableCell>
                          <TableCell>{mrp}</TableCell>
                          <TableCell>{purchaseQty}</TableCell>
                          <TableCell>
                            <TextField
                              id="outlined-number"
                              type="number"
                              value={rQty}
                              onChange={(e) => handleReturnQuantity(e)}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              // inputProps={{
                              //   min: 1,
                              //   max: purchaseQty,
                              // }}
                              error={!!errors.rQty}
                              helperText={errors.rQty}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              id="outlined-number"
                              type="number"
                              value={td}
                              onChange={(e) => handleTdChange(e)}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                min: 1,
                                max: 100,
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              id="outlined-number"
                              type="number"
                              disabled
                              value={total}
                              onChange={(e) => setTotal(e.target.value)}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                      {successMessage && (
                        <Alert severity="success">
                          <AlertTitle>Success</AlertTitle>
                          {successMessage}
                        </Alert>
                      )}
                      {failureMessage && (
                        <Alert severity="error">
                          <AlertTitle>Error</AlertTitle>
                          {failureMessage}
                        </Alert>
                      )}
                      <TableBody>
                        <TableRow>
                          <TableCell class="text-right">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleReturnSubmit}
                            >
                              Return
                            </Button>
                          </TableCell>
                          <TableCell
                            class="text-end font-weight-bold"
                            colspan="4"
                          >
                            Grand Total:
                          </TableCell>

                          <TableCell>
                            <TextField
                              label="Total"
                              variant="outlined"
                              value={total}
                              disabled
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseReturn;
