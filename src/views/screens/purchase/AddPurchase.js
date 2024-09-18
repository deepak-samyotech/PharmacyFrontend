import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import PrintIcon from "@mui/icons-material/Print";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Modal from "@mui/material/Modal";
import logo from "../../../assets/images/logo.svg";
import Swal from "sweetalert2";
import { fetchSupplierByName, postPurchaseData, postPurchaseHistoryData, postSupplierLedgerData, postSupplierPaymentData, postUpplierLedgerData } from "utils/api";

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

const childStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  height: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  margin: "10px",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  childModelButton: {
    display: "inline-block",
    marginRight: "10px", // Adjust spacing between buttons
  },
  PurchaseModelButton: {
    display: "inline-block",
    marginRight: "10px", // Adjust spacing between buttons
  },
};
const StyledButton = styled(Button)`
  && {
    display: "inline";
    marginright: "10px";
  }
`;
function ChildModal({ data }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <StyledButton
        variant="contained"
        color="primary"
        // size='small'
        style={{ margin: "5px" }}
        onClick={handleOpen}
      >
        Print & Submit
      </StyledButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={childStyle}>
          <Typography id="modal-modal-description">
            <Card sx={tablediv} style={{ backgroundColor: "#ffffff" }}>
              <CardContent>
                <div className="bg-light">
                  <Grid
                    style={{ display: "flex", justifyContent: "center" }}
                    spacing={2}
                  >
                    <Grid item xs={6} md={10} lg={10}>
                      <img src={logo} alt="logo" />
                    </Grid>
                  </Grid>
                  <hr />
                  <div style={{ marginBottom: "10px" }}>
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
                  <div style={{ marginBottom: "10px" }}>
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
                          <p>{data}</p>
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
                      style={{ marginTop: "20px" }}
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
                    <Grid style={{ marginTop: "20px" }}>
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
    </React.Fragment>
  );
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#808080",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function AddPurchase() {
  const [open, setOpen] = React.useState(false);
  const handleOpen1 = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [medicineData, setMedicineData] = useState([]);
  // const [supplierName, setSupplierName] = useState("");

  // const [invoiceNumber, setInvoiceNumber] = useState('');
  const [quantities, setQuantities] = useState({});
  // const [paidAmount, setPaidAmount] = useState(0);
  const [paymentDetailsVisible, setPaymentDetailsVisible] = useState(false);
  // const [paymentType, setPaymentType] = useState('');
  const [receiverName, setReceiverName] = useState("");
  const [payDate, setPayDate] = useState("");
  const [supplier_Name, setSupplier_Name] = useState("");

  const handleChange = (event) => {
    setPaymentType(event.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (supplier_Name.trim() !== "") {
        fetchData();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [supplier_Name]);
  const fetchData = async () => {
    try {
      const response = await fetchSupplierByName(supplier_Name);

      setMedicineData(response?.data?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const rows = medicineData || [];

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const navigate = useNavigate();
  const handleButtonClick1 = () => {
    navigate("/purchase/manage-purchase");
  };
  const handleButtonClick2 = () => {
    navigate("/supplier/add-supplier");
  };
  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };

  const columns = [
    { id: "product_name", label: "Medicine", align: "center" },
    { id: "generic_name", label: "G. Name", align: "center" },
    { id: "form", label: "Form", align: "center" },
    { id: "expire_date", label: "Expire Date", align: "center" },
    { id: "stock", label: "Stock", align: "center" },
    { id: "qty", label: "Qty", align: "center" },
    { id: "trade_price", label: "TP", align: "center" },
    { id: "mrp", label: "M.R.P.", align: "center" },
    { id: "w_discount", label: "Disc.(W)", align: "center" },
    { id: "total", label: "Total", align: "center" },
  ];

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseDetails, setPurchaseDetails] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [gtotal_amount, setGtotal_amount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [totalPaid, setTotalPaid] = useState("");
  const [totalDue, setTotalDue] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [bank_id, setBank_id] = useState("");
  const [cheque_no, setCheque_no] = useState("");
  const [issue_date, setIssue_date] = useState("");
  const [receiver_name, setReceiver_name] = useState("");
  const [receiver_contact, setReceiver_contact] = useState("");
  const [paid_amount, setPaid_amount] = useState("");
  const [date, setDate] = useState("");
  const [supplier_Id, setSupplier_Id] = useState("");
  // const [supplier_Name, setSupplier_Name] = useState("");

  const handleSupplierNameChange = (e) => {
    setSupplier_Name(e.target.value);
  };
  //current date & time
  const currentDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { supplier_name, supplier_id } = medicineData[0];
    const formDataPurchase = new FormData();
    formDataPurchase.append("invoice_no", invoiceNumber);
    formDataPurchase.append("pur_date", currentDate);
    formDataPurchase.append("sid", supplier_id);
    formDataPurchase.append("supplier_name", supplier_name);
    formDataPurchase.append("pur_details", purchaseDetails);
    formDataPurchase.append("total_discount", totalDiscount);
    formDataPurchase.append("gtotal_amount", totalAmount);
    formDataPurchase.append("entry_date", payDate);
    // console.log("gtotal_amount : ",totalAmount)
    const formDataSupplierLedger = new FormData();
    formDataSupplierLedger.append("supplier_id", supplier_id);
    formDataSupplierLedger.append("supplier_name", supplier_name);
    formDataSupplierLedger.append("total_amount", totalAmount);
    formDataSupplierLedger.append("total_paid", totalPaid);
    formDataSupplierLedger.append("total_due", totalDue);

    const formDataSupplierPayment = new FormData();
    formDataSupplierPayment.append("type", paymentType);
    formDataSupplierPayment.append("supp_id", supplier_id);
    formDataSupplierPayment.append("bank_id", bank_id);
    formDataSupplierPayment.append("cheque_no", cheque_no);
    formDataSupplierPayment.append("issue_date", issue_date);
    formDataSupplierPayment.append("receiver_name", receiver_name);
    formDataSupplierPayment.append("receiver_contact", receiver_contact);
    formDataSupplierPayment.append("paid_amount", totalPaid);
    formDataSupplierPayment.append("date", date);

    const formDataPurchaseHistory = new FormData();
    rows.forEach((item) => {
      for (var key in item) {
        if (key === "sale_qty") {
          formDataPurchaseHistory.append(key, quantities[item.id]);
        } else {
          formDataPurchaseHistory.append(key, item[key]);
        }
      }
    });
    formDataPurchaseHistory.append("supplier_id", supplier_id);
    formDataPurchaseHistory.append("invoice_no", invoiceNumber);
    formDataPurchaseHistory.append("date", currentDate);
    formDataPurchaseHistory.append("total_amount", totalAmount);
    formDataPurchaseHistory.append("details", purchaseDetails);

    try {
      const response = await postPurchaseData(formDataPurchase);
      
          if (response?.status === 200) {
            Swal.fire({
              title: "Purchase Add Successfully !",
              text: "You clicked the button!",
              icon: "success",
            });
  
            setOpen(false);
            // setTimeout(() => {
            //   window.location.reload();
            // }, 1000);
          }
  
  
      await postSupplierLedgerData(formDataSupplierLedger);
       
      await postSupplierPaymentData(formDataSupplierPayment);
  
      await postPurchaseHistoryData(formDataPurchaseHistory);
    } catch (error) {
      console.log("Error : ", error);
      Swal.fire({
            title: "Error !",
            text: "Something went Wrong!",
            icon: "error",
          });
    }

  };

  // Calculate grand total
  useEffect(() => {
    const grandTotal = medicineData.reduce((total, row) => {
      return total + (quantities[row.id] || 0) * row.mrp;
    }, 0);
    setTotalAmount(grandTotal);
  }, [medicineData, quantities]);

  useEffect(() => {
    const calculatedDueAmount = totalAmount - totalPaid;
    setTotalDue(calculatedDueAmount);
  }, [totalAmount, totalPaid]);

  const handlePaidAmountChange = (e) => {
    setTotalPaid(Number(e.target.value));
    setPaymentDetailsVisible(true);
  };

  const handleReviewButtonClick = () => {
    // Implement logic to save payment details or navigate to review page
  };

  // Generate custom invoice number
  useEffect(() => {
    const generatedInvoiceNumber = `${supplier_Name
      .substr(0, 3)
      .toUpperCase()}-${Date.now().toString().substr(-8)}`;
    setInvoiceNumber(generatedInvoiceNumber);
  }, [supplier_Name]);

  return (
    <>
      <div style={{ margin: "10px" }}>
        <Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
          <Button
            onClick={handleButtonClick1}
            variant="contained"
            startIcon={<MenuIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Manage Purchase
          </Button>
          <Button
            onClick={handleButtonClick2}
            variant="contained"
            startIcon={<AddIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Add Supplier
          </Button>
        </Stack>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardContent>
            <div className="bg-light">
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <h3>New Purchase</h3>
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: "blue" }} />
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <TextField
                      id="filled-textarea"
                      label="Company Name"
                      placeholder="Company Name"
                      multiline
                      value={supplier_Name}
                      onChange={handleSupplierNameChange} // Update supplierName when the input changes
                      variant="standard"
                    />
                    <TextField
                      id="filled-textarea"
                      label="Invoice No"
                      placeholder="Invoice No"
                      multiline
                      // variant='filled'
                      variant="standard"
                      value={invoiceNumber} // Display custom invoice number
                    />
                    <TextField
                      id="filled-textarea"
                      label="Invoice Date"
                      placeholder="Invoice Date"
                      type="date"
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      defaultValue={currentDate}
                    />
                    {/* <Input
                  disabled
                  defaultValue={currentDate}
                  inputProps={ariaLabel}
                /> */}
                    <TextField
                      id="filled-textarea"
                      label="Note"
                      placeholder="Note"
                      multiline
                      variant="standard"
                      value={purchaseDetails}
                      onChange={(e) => setPurchaseDetails(e.target.value)}
                    />
                  </div>
                </Grid>
              </Grid>
              <div>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <StyledTableCell key={column.id} align={column.align}>
                            {column.label}
                          </StyledTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <StyledTableRow key={row.id}>
                          {columns.map((column) => (
                            <StyledTableCell
                              key={column.id}
                              align={column.align}
                            >
                              {column.id === "imageUrl" ? (
                                row[column.id] ? (
                                  <img
                                    src={row[column.id]}
                                    alt="img"
                                    style={{
                                      maxWidth: "50px",
                                      maxHeight: "50spx",
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : (
                                  "no image"
                                )
                              ) : column.id === "qty" ? (
                                <TextField
                                  id="qty"
                                  placeholder="0.00"
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  value={quantities[row.id] || ""}
                                  onChange={(e) =>
                                    handleQuantityChange(row.id, e.target.value)
                                  }
                                />
                              ) : column.id === "w_discount" ? (
                                <TextField
                                  id="w_discount"
                                  placeholder="0.00"
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  value={totalDiscount}
                                  onChange={(e) =>
                                    setTotalDiscount(e.target.value)
                                  }
                                />
                              ) : column.id === "total" ? (
                                // Calculation for total
                                (quantities[row.id] || 0) * row.mrp
                              ) : (
                                row[column.id]
                              )}
                            </StyledTableCell>
                          ))}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <Grid container spacing={2} marginTop={"10px"}>
                <Grid xs={2} md={9} lg={9}></Grid>
                <Grid xs={10} md={3} lg={3}>
                  <Grid xs={12} md={12} lg={12} marginTop={"20px"}>
                    <TextField
                      id="outlined-number"
                      label="Grand Total: "
                      type="number"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={totalAmount}
                    />
                  </Grid>
                  <Grid xs={12} md={12} lg={12} marginTop={"20px"}>
                    <TextField
                      id="outlined-number"
                      label="Total Paid: "
                      type="number"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={totalPaid}
                      onChange={handlePaidAmountChange}
                    />
                  </Grid>
                  <Grid xs={12} md={12} lg={12} marginTop={"20px"}>
                    <TextField
                      id="outlined-number"
                      label="Total Due: "
                      type="number"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => setTotalDue(e.target.value)}
                      value={totalDue < 0 ? 0 : totalDue} // Ensure due amount is not negative
                    />
                  </Grid>
                </Grid>
                <Grid>
                  {paymentDetailsVisible && (
                    <Grid container spacing={2} marginTop={"10px"}>
                      <FormControl sx={{ mb: 1, pr: 1, minWidth: 120 }}>
                        <InputLabel id="paymentType">Payment Type</InputLabel>
                        <Select
                          labelId="paymentType"
                          id="demo-simple-select-helper"
                          value={paymentType}
                          label="Payment Type"
                          size="small"
                          onChange={handleChange}
                        >
                          <MenuItem value={"Cash"}>Cash</MenuItem>
                          <MenuItem value={"Credit"}>Credit</MenuItem>
                          <MenuItem value={"Cheque"}>Cheque</MenuItem>
                        </Select>
                      </FormControl>
                      {paymentType === "Cheque" && (
                        <>
                          <TextField
                            id="outlined-basic"
                            label="Select Bank"
                            size="small"
                            variant="outlined"
                            value={bank_id}
                            onChange={(e) => setBank_id(e.target.value)}
                            style={{
                              marginBottom: "10px",
                              paddingRight: "10px",
                            }}
                          />
                          <TextField
                            id="outlined-basic"
                            label="Cheque Number"
                            size="small"
                            variant="outlined"
                            value={cheque_no}
                            onChange={(e) => setCheque_no(e.target.value)}
                            style={{
                              marginBottom: "10px",
                              paddingRight: "10px",
                            }}
                          />
                          <TextField
                            id="outlined-basic"
                            label="Issue Date"
                            size="small"
                            type="date"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={issue_date}
                            onChange={(e) => setIssue_date(e.target.value)}
                            style={{
                              marginBottom: "10px",
                              paddingRight: "10px",
                            }}
                          />
                        </>
                      )}
                      <TextField
                        id="outlined-basic"
                        label="Receiver Name"
                        size="small"
                        variant="outlined"
                        value={receiver_name}
                        onChange={(e) => setReceiver_name(e.target.value)}
                        style={{ marginBottom: "10px", paddingRight: "10px" }}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Receiver Contact"
                        size="small"
                        variant="outlined"
                        value={receiver_contact}
                        onChange={(e) => setReceiver_contact(e.target.value)}
                        style={{ marginBottom: "10px", paddingRight: "10px" }}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Payment Date"
                        size="small"
                        type="date"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ marginBottom: "10px", paddingRight: "10px" }}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleOpen1}
                        style={{ marginBottom: "10px", paddingRight: "10px" }}
                      >
                        Review
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </div>
          </CardContent>
        </Card>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "90%", height: "auto" }}>
          {/* <h2 id='parent-modal-title'>LOGO</h2> */}
          <div>
            <img
              src={logo}
              alt="logo"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
                margin: "10px auto",
              }}
            />
          </div>
          <Divider sx={{ borderColor: "blue" }} />
          <Grid container spacing={2}>
            <Grid xs={6} md={10} lg={10}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "10px",
                  marginBottom: "10px",
                }}
              >
                <TextField
                  id="filled-textarea"
                  label="Company Name"
                  placeholder="Company Name"
                  multiline
                  value={supplier_Name}
                  onChange={handleSupplierNameChange} // Update supplierName when the input changes
                  variant="standard"
                />
                <TextField
                  id="filled-textarea"
                  label="Invoice No"
                  placeholder="Invoice No"
                  multiline
                  variant="standard"
                  value={invoiceNumber}
                />
                <TextField
                  id="filled-textarea"
                  label="Invoice Date"
                  placeholder="Invoice Date"
                  type="date"
                  variant="standard"
                  value={currentDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  id="filled-textarea"
                  label="Note"
                  placeholder="Note"
                  multiline
                  variant="standard"
                  value={purchaseDetails}
                  onChange={(e) => setPurchaseDetails(e.target.value)}
                />
              </div>
            </Grid>
          </Grid>
          <div>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: "50vh", overflow: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <StyledTableCell key={column.id} align={column.align}>
                        {column.label}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .filter((row) => quantities[row.id] > 0) // Filter rows with quantity greater than 0
                    .map((row, index) => (
                      <StyledTableRow key={row.id}>
                        {columns.map((column) => (
                          <StyledTableCell key={column.id} align={column.align}>
                            {column.id === "imageUrl" ? (
                              row[column.id] ? (
                                <img
                                  src={row[column.id]}
                                  alt="img"
                                  style={{
                                    maxWidth: "50px",
                                    maxHeight: "50px",
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                "no image"
                              )
                            ) : column.id === "qty" ? (
                              <TextField
                                id="qty"
                                placeholder="0.00"
                                variant="outlined"
                                size="small"
                                type="number"
                                value={quantities[row.id] || ""}
                                onChange={(e) =>
                                  handleQuantityChange(row.id, e.target.value)
                                }
                              />
                            ) : column.id === "w_discount" ? (
                              <TextField
                                id="w_discount"
                                placeholder="0.00"
                                variant="outlined"
                                size="small"
                                type="number"
                              />
                            ) : column.id === "total" ? (
                              // Calculation for total
                              (quantities[row.id] || 0) * row.mrp
                            ) : (
                              row[column.id]
                            )}
                          </StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {/* <Divider sx={{ borderColor: 'gray', mt: 2, mb: 5, width: '100%' }} /> */}
          <div className="d-flex justify-content-end align-items-end">
            <Grid container spacing={2} marginTop={"10px"}>
              <Grid xs={12} md={12} lg={12} marginTop={"20px"}>
                <Grid
                  container
                  spacing={2}
                  marginTop={"10px"}
                  justifyContent="flex-end"
                >
                  <TextField
                    id="outlined-number"
                    label="Grand Total: "
                    type="number"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={totalAmount}
                    style={{ marginRight: "10px" }}
                  />
                  <TextField
                    id="outlined-number"
                    label="Total Paid: "
                    type="number"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={totalPaid}
                    onChange={handlePaidAmountChange}
                    style={{ marginRight: "10px" }}
                  />
                  <TextField
                    id="outlined-number"
                    label="Total Due: "
                    type="number"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setTotalDue(e.target.value)}
                    value={totalDue < 0 ? 0 : totalDue} // Ensure due amount is not negative
                    style={{ marginRight: "10px" }}
                  />
                </Grid>
              </Grid>
              <Grid>
                {paymentDetailsVisible && (
                  <Grid container spacing={2} marginTop={"10px"}>
                    <FormControl sx={{ mb: 1, pr: 1, minWidth: 120 }}>
                      <InputLabel id="paymentType">Payment Type</InputLabel>
                      <Select
                        labelId="paymentType"
                        id="demo-simple-select-helper"
                        value={paymentType}
                        label="Payment Type"
                        size="small"
                        onChange={handleChange}
                      >
                        <MenuItem value={"Cash"}>Cash</MenuItem>
                        <MenuItem value={"Credit"}>Credit</MenuItem>
                        <MenuItem value={"Cheque"}>Cheque</MenuItem>
                      </Select>
                    </FormControl>
                    {paymentType === "Cheque" && (
                      <>
                        <TextField
                          id="outlined-basic"
                          label="Select Bank"
                          size="small"
                          variant="outlined"
                          value={bank_id}
                          onChange={(e) => setBank_id(e.target.value)}
                          style={{
                            marginBottom: "10px",
                            paddingRight: "10px",
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Cheque Number"
                          size="small"
                          variant="outlined"
                          value={cheque_no}
                          onChange={(e) => setCheque_no(e.target.value)}
                          style={{
                            marginBottom: "10px",
                            paddingRight: "10px",
                          }}
                        />
                        <TextField
                          id="outlined-basic"
                          label="Issue Date"
                          size="small"
                          type="date"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={issue_date}
                          onChange={(e) => setIssue_date(e.target.value)}
                          style={{
                            marginBottom: "10px",
                            paddingRight: "10px",
                          }}
                        />
                      </>
                    )}
                    <TextField
                      id="outlined-basic"
                      label="Receiver Name"
                      size="small"
                      variant="outlined"
                      value={receiver_name}
                      onChange={(e) => setReceiver_name(e.target.value)}
                      style={{ marginBottom: "10px", paddingRight: "10px" }}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Receiver Contact"
                      size="small"
                      variant="outlined"
                      value={receiver_contact}
                      onChange={(e) => setReceiver_contact(e.target.value)}
                      style={{ marginBottom: "10px", paddingRight: "10px" }}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Payment Date"
                      size="small"
                      type="date"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={{ marginBottom: "10px", paddingRight: "10px" }}
                    />
                    <Grid container spacing={2} justifyContent="flex-end">
                      <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={handleClose}
                        style={{ margin: "5px" }}
                      >
                        Cancel
                      </StyledButton>
                      <StyledButton
                        variant="contained"
                        color="primary"
                        style={{ margin: "5px" }}
                      >
                        Barcode
                      </StyledButton>
                      <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        style={{ margin: "5px" }}
                      >
                        Submit
                      </StyledButton>
                      <ChildModal data={supplier_Name} />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default AddPurchase;
