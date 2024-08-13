/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Input from "@mui/material/Input";
import Grid from "@mui/material/Unstable_Grid2";
import MenuIcon from "@mui/icons-material/Menu";
import Fab from "@mui/material/Fab";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import "./pos.css";
import Swal from "sweetalert2";
import { set } from "immutable";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Modal from '@mui/material/Modal';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
const ariaLabel = { "aria-label": "description" };

const Pos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [cus_contact, setCus_contact] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [quantity, setQuantity] = useState("");
  const [tableData, setTableData] = useState([]);
  const [discount, setDiscount] = useState("");
  const [products, setProducts] = useState("");
  const [customerType, setCustomerType] = useState("");
  // post api for customer ledger
  const [paid, setPaid] = useState("");
  const [totalbalance, setTotalbalance] = useState("");
  const [totalDue, setTotalDue] = useState("");

  // const [customerId, setCustomerId] = useState("");
  //post for invoice
  const [data3, setData3] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/medicine");

        const transformedData = response.data?.data?.map((item) => ({
          id: item.id,
          medicineName: item.product_name || 0,
          genericName: item.generic_name || 0,
          company: item.supplier_name || 0,
          strength: item.strength || 0,
          QtyAvailable: item.instock || 0,
          expDate: item.expire_date || 0,
          image: item.image || "",
        }));

        //3.) top sale
        // Sort data based on sale count
        transformedData.sort((a, b) => b.saleCount - a.saleCount);
        
        // Select top 10 medicines based on sale count
        const top10Medicines = transformedData.slice(0, 10);

        setData3(top10Medicines);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const searchMedicines = async () => {
      try {
        const medicineResponse = await axios.get(
          `http://localhost:8080/medicine/search?product_id=${product_id}`,
          {
            params: { query: searchTerm },
          }
        );
        setMedicines(medicineResponse.data.medicines);
      } catch (error) {
        console.error("Error searching for medicines:", error);
      }
    };

    const searchCustomer = async () => {
      try {
        const customerResponse = await axios.get(
          `http://localhost:8080/customer/search?cus_contact=${cus_contact}`,
          {
            params: { query: searchTerms },
          }
        );
        const customerData = customerResponse.data.customer;
        const customerType =
          customerData.length > 0 ? customerData[0].c_type : "";
        setCustomer(customerData);
        setCustomerType(customerType);
      } catch (error) {
        console.error("Error searching for customer:", error);
      }
    };

    if (searchTerm && product_id) {
      setTimeout(() => {
        searchMedicines();
      }, 1000);
    } else {
      setMedicines([]);
    }

    if (searchTerms && cus_contact) {
      setTimeout(() => {
        searchCustomer();
      }, 1000);
    } else {
      setCustomer([]);
    }

    fetchData();
  }, [searchTerm, product_id, searchTerms, cus_contact]);

  console.error("setMedicines:", medicines);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    setProduct_id(event.target.value);
  };
  const handleChange1 = (event) => {
    setSearchTerms(event.target.value);
    setCus_contact(event.target.value);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const medicineList = tableData.map((item) => item.productName);
  const qty = tableData.map((item) => item.quantity);
  const product_total = tableData.map((item) => item.total);

  const customerName = customer.map((item) => item.c_name);
  const contact = customer.map((item) => item.cus_contact);
  const cusType = customer.map((item) => item.c_type);
  const customerId = customer.map((item) => item.c_id);


  const handleAddToTable = () => {
    const selectedMedicine = medicines.find(
      (medicine) => medicine.product_id === product_id
    );
    if (selectedMedicine) {
      const total = parseFloat(selectedMedicine.mrp) * parseFloat(quantity);
      const newData = {
        productName: selectedMedicine.product_name,
        quantity: quantity,
        total: total.toFixed(2),
        genericName: selectedMedicine.generic_name, // Add generic name to newData
        medMrp: selectedMedicine.mrp, // Add MRP to newData
        discount: selectedMedicine.w_discount, // Add discount to newData
      };
      setTableData([...tableData, newData]);
    }
  };

  // post api for customer ledger & invoice

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct formDataCustomerLedger
    const formDataCustomerLedger = new FormData();
    formDataCustomerLedger.append("customer_id", customerId);
    formDataCustomerLedger.append("customer_name", customerName);
    formDataCustomerLedger.append("total_balance", calculateTotal());
    formDataCustomerLedger.append("total_paid", paid);
    formDataCustomerLedger.append("total_due", calculateDue());

    // Construct formDataManageInvoice
    const formDataManageInvoice = new FormData();
    formDataManageInvoice.append("customerName", customerName);
    formDataManageInvoice.append("contact", contact);
    formDataManageInvoice.append("customerType", customerType);
    formDataManageInvoice.append(
      "createDate",
      new Date().toISOString().split("T")[0]
    );

    // Map tableData to construct medicineData array
    const medicineData = tableData.map((item) => ({
      medicine: item.productName,
      qty: item.quantity,
      product_total: item.total,
      genericName: item.genericName, // Include generic name
      medMrp: item.medMrp, // Include MRP
      discount: item.discount, // Include discount
    }));

    // Append medicineData array to formDataManageInvoice
    medicineData.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        formDataManageInvoice.append(`medicineData[${index}][${key}]`, value);
      });
    });
    formDataManageInvoice.append("customer_id", customerId);
    formDataManageInvoice.append("grand_total", calculateTotal());
    formDataManageInvoice.append("total_paid", paid);
    formDataManageInvoice.append("total_due", calculateDue());

    axios
      .post(`http://localhost:8080/Customer_ledger`, formDataCustomerLedger, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          Swal.fire({
            title: "Data Save Successfully !",
            text: "You clicked the button!",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          title: "Error !",
          text: "You clicked the button!",
          icon: "error",
        });
      });

    axios
      .post(`http://localhost:8080/manage_invoice`, formDataManageInvoice, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // Function to calculate the total amount
  const calculateTotal = () => {
    let total = 0;
    tableData.forEach((item) => {
      total += parseFloat(item.total);
    });
    return total.toFixed(2);
  };
  const handleTotalAmountChange = () => {
    const totalAmount = calculateTotal();
    setTotalbalance(totalAmount);
  };
  // Function to calculate the payable amount
  const calculatePayable = () => {
    const totalAmount = calculateTotal();
    if (totalAmount && customer.length > 0) {
      const regularDiscount = parseFloat(customer[0].regular_discount || 0);
      const discountedAmount =
        totalAmount - (totalAmount * regularDiscount) / 100;
      return discountedAmount.toFixed(2);
    }
    return "";
  };

  // Function to calculate the return amount
  const calculateReturn = () => {
    const totalAmount = calculateTotal();
    if (totalAmount && paid !== "") {
      const payableAmount = calculatePayable();
      const returnAmount = parseFloat(paid) - parseFloat(payableAmount);
      if (returnAmount > 0) {
        return returnAmount.toFixed(2);
      }
    }
    return "";
  };
  // Function to calculate the due amount
  const calculateDue = () => {
    const totalAmount = calculateTotal();
    if (totalAmount && paid !== "") {
      const payableAmount = calculatePayable();
      const dueAmount = parseFloat(payableAmount) - parseFloat(paid);
      if (dueAmount > 0) {
        return dueAmount.toFixed(2);
      }
    }
    return "";
  };
  const handleDueAmountChange = () => {
    const totaldue1 = calculateDue();
    setTotalDue(totaldue1);
  };
  // Function to handle changes in discount and paid fields
  const handleNumberChange = (event, field) => {
    const inputValue = event.target.value.replace(/[^0-9.]/g, "");
    switch (field) {
      case "discount":
        setDiscount(inputValue);
        break;
      case "paid":
        setPaid(inputValue);
        break;
      default:
        break;
    }
  };

  // Handle removing a product from the table
  const handleRemoveProduct = (index) => {
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);
  };

  //checkbox
  const [isChecked, setIsChecked] = useState(false);

  const data = [
    { id: 1, productName: "T987654", quantity: "2000", total: "9876543210" },
  ];
  // navigation
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/customer/add-customer");
  };
  const handleButtonClick1 = () => {
    navigate("/invoice/manage-invoice");
  };

  //current date & time
  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });

  // Pos section functionality
  const [posData, setPosData] = useState([]);
  const [open, setOpen] = useState(false);
  const [posId, setPosId] = useState("");
  const [posValue, setPosValue] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
  };

  const handleOpen = async () => {
    try {
      setOpen(true);
      
      const response = await axios.get("http://localhost:8080/medicine");

      console.log("res -> ", response);

      if (!(response.data.data.length > 0)) {
        toast.warning("There is no Product");
        setOpen(false);
        return;
      }

      const filteredData = response.data.data.filter(item => item.posStatus === false);

      console.log("filterdata -> ", filteredData);

      if (!(filteredData.length > 0)) {
        setOpen(false);
        toast.warning("All product values are configured.");
      }

      await setPosData(filteredData);

      console.log("posData -> ", posData);

    } catch (error) {
      console.log(error);
      toast.error("Not able to open modal");
    }

  }

  const handleSubmitPos = () => {

    axios
      .post(`http://localhost:8080/pos/set_value`, { productId: posId, value: posValue })
      .then((response) => {
        if (response.status === 200) {
          setOpen(false);
          setPosId("");
          setPosValue("");
          toast.success("Configuration saved Successfully");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <div style={{ margin: "10px" }}>
        <Card style={{ backgroundColor: "#ffffff", boxShadow: "20px" }}>
          <CardContent>
            <div className="bg-light">
              <Grid xs={12} md={12}>
                <Grid container spacing={3} justifyContent="space-between">
                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={customerType}
                        onChange={(event) => setCustomerType(event.target.value)}
                      >
                        <FormControlLabel
                          value="Walk_in"
                          control={<Radio />}
                          label="Walk-in Customer"
                        // disabled={customerType !== ""}
                        />
                        <FormControlLabel
                          value="Regular"
                          control={<Radio />}
                          label="Regular Customer"
                        // disabled={customerType !== ""}
                        />
                        <FormControlLabel
                          value="Wholesale"
                          control={<Radio />}
                          label="Wholesale Customer"
                        // disabled={customerType !== ""}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* ))} */}
                  {/* </FormControl>
                </Grid> */}
                  <Stack
                    direction="row"
                    spacing={1}
                    style={{
                      marginBottom: "15px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      onClick={handleOpen}
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                    >
                      Configure POS
                    </Button>
                    <Button
                      onClick={handleButtonClick}
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                    >
                      Create New Customer
                    </Button>
                    <Button
                      onClick={handleButtonClick1}
                      variant="contained"
                      size="small"
                      startIcon={<MenuIcon />}
                      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                    >
                      Manage Invoice
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                {/* Phone Number TextField */}
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Phone Number"
                    fullWidth
                    placeholder="Enter Phone No."
                    size="small"
                    value={searchTerms}
                    onChange={handleChange1}
                    sx={{ mr: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {customer.map((customer, index) => (
                  <>
                    {/* Customer Name TextField */}
                    <Grid item xs={12} md={2} key={index}>
                      <TextField
                        label="Customer Name"
                        fullWidth
                        size="small"
                        value={customer.c_name}
                        sx={{ mr: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    {/* Customer ID TextField */}
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Customer ID"
                        fullWidth
                        size="small"
                        value={customer.c_id}
                        sx={{ mr: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircleIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                ))}

                {/* Date TextField */}
                <Grid item xs={12} md={2}>
                  <Input
                    disabled
                    defaultValue={currentDate}
                    inputProps={ariaLabel}
                  />
                </Grid>

                {/* Time TextField */}
                <Grid item xs={12} md={2}>
                  <Input
                    disabled
                    defaultValue={currentTime}
                    inputProps={ariaLabel}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={4}>
                {/* Product ID TextField */}
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Product ID"
                    placeholder="Enter Product ID"
                    fullWidth
                    size="small"
                    value={searchTerm}
                    onChange={handleChange}
                    sx={{ mr: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalMallIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {medicines.map((medicine, index) => (
                  <>
                    <Grid item xs={12} md={2} key={index}>
                      <TextField
                        label="Product Name"
                        fullWidth
                        size="small"
                        sx={{ mr: 1 }}
                        value={medicine.product_name}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventNoteIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Generic Name Dropdown */}
                    <Grid item xs={12} md={2} key={index}>
                      <TextField
                        label="Generic Name"
                        fullWidth
                        size="small"
                        value={medicine.generic_name}
                        sx={{ mr: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalPharmacyIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                ))}

                {/* Quantity TextField */}
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Quantity"
                    fullWidth
                    placeholder="Enter Quantity"
                    size="small"
                    value={quantity}
                    onChange={handleQuantityChange}
                    sx={{ mr: 1 }}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        handleAddToTable();
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalMallIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* <button onClick={handleAddToTable}>Add to Table</button> */}
                </Grid>
                {medicines.map((medicine, index) => (
                  <>
                    {/* MRP TextField */}
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="MRP"
                        fullWidth
                        size="small"
                        value={medicine.mrp}
                        sx={{ mr: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalMallIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    {/* Stock TextField */}
                    <Grid item xs={12} md={2}>
                      <TextField
                        label="Stock"
                        fullWidth
                        size="small"
                        value={medicine.instock}
                        sx={{ mr: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocalMallIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </>
                ))}
              </Grid>
              <Grid container spacing={4} sx={{ marginBottom: "20px" }}>
                {/* First Table */}
                <Grid item xs={12} md={6}>
                  <Paper>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.total}</TableCell>
                              <TableCell>
                                <Fab aria-label="edit">
                                  <DisabledByDefaultIcon
                                    onClick={() => handleRemoveProduct(index)}
                                  />
                                </Fab>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>

                {/* Second Table */}
                <Grid item xs={12} md={3}>
                  <Paper>
                    <Box
                      component="form"
                      sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
                      noValidate
                      autoComplete="off"
                    >
                      {/* Display Total Tk. */}
                      <TextField
                        label="Total Tk."
                        type="text"
                        value={calculateTotal()}
                        // onChange={(event) => handleTotalAmountChange(event.target.value)}
                        size="small"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Discount Field */}
                      {customer.map((customer, index) => (
                        <TextField
                          key={index}
                          label="Discount"
                          type="number"
                          size="small"
                          value={customer.regular_discount}
                          onChange={(event) =>
                            handleNumberChange(event, "discount")
                          }
                        />
                      ))}
                      {/* Payable Tk. Field */}
                      <TextField
                        label="Payable Tk."
                        type="text"
                        size="small"
                        value={calculatePayable()}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Paid Tk. Field */}
                      <TextField
                        label="Paid Tk."
                        size="small"
                        type="number"
                        value={paid}
                        onChange={(event) => handleNumberChange(event, "paid")}
                      />
                      {/* Return Tk. Field */}
                      <TextField
                        label="Return Tk."
                        size="small"
                        type="text"
                        value={calculateReturn()}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Due Tk. Field */}
                      <TextField
                        label="Due Tk."
                        type="text"
                        size="small"
                        value={calculateDue()}
                        // onChange={(event) => handleDueAmountChange(event.target.value)}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>

                {/* Third Table */}
                <Grid item xs={12} md={3}>
                  <Paper
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "auto",
                    }}
                  >
                    <Card
                      style={{
                        maxHeight: "300px",
                        border: "2px solid",
                        borderColor: "lightgray",
                        flexGrow: 1,
                        overflowY: "auto", // Add this to enable scrolling
                      }}
                    >
                      <CardHeader
                        title="Super Sale"
                        style={{ backgroundColor: "#E0FFFF" }}

                      />
                      <CardContent style={{ fontSize: "0.8rem", padding: 0 }}>
                        {/* Adjust font size and remove padding */}
                        <Typography color="text.secondary">
                          <div>
                            <List
                              sx={{
                                width: "100%",
                                maxWidth: 360,
                                bgcolor: "background.paper",
                              }}
                            >
                              {data3.map((item, index) => (
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
                                          {item.medicineName}
                                        </Typography>
                                        <br />
                                        <Typography
                                          component="span"
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          {item.genericName}
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
                                          Exp Date: {item.expDate}
                                        </Typography>
                                      </React.Fragment>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </div>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Paper>
                </Grid>
              </Grid>
              {/* <hr /> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Stack spacing={20} direction="row">
                  <Button
                    variant="contained"
                    onClick={() => alert(" Sale & Invoice clicked")}
                  >
                    Sale & Invoice
                  </Button>
                  <Button variant="contained" onClick={handleSubmit}>
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => alert("Invoice & Print clicked")}
                  >
                    Invoice & Print
                  </Button>
                </Stack>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description">
              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardContent>
                  <div className="bg-light">
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={10} lg={10}>
                        <h3 className="text-primary">Configure POS</h3>
                      </Grid>
                      <Grid item xs={6} md={2} lg={2}>
                        Wednesday 7th of February 2024 04:37:08 PM
                      </Grid>
                    </Grid>
                    <hr />
                    <div style={{ marginBottom: "20px" }}>
                      <Grid container spacing={2}>
                        {/* First Column */}
                        <Grid item xs={12} md={6}>
                          <Box
                            component="form"
                            sx={{
                              "& .MuiTextField-root": { m: 1, width: "100%" },
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <Grid item>
                              <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                  Select Product
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  label="Select Product"
                                  id="demo-simple-select"
                                  value={posId}
                                  onChange={(e) => setPosId(e.target.value)}
                                  multiline
                                  variant="outlined"
                                >
                                  {posData.map((medData) => (
                                    <MenuItem
                                      key={medData.id}
                                      value={medData.id}
                                    >
                                      {medData.product_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>

                          </Box>
                        </Grid>
                        {/* Second Column */}
                        <Grid item xs={12} md={6}>
                          <Box
                            component="form"
                            sx={{
                              "& .MuiTextField-root": { m: 1, width: "100%" },
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              label="Value"
                              fullWidth
                              value={posValue}
                              onChange={(e) => setPosValue(e.target.value)}
                              multiline
                              variant="outlined"
                            />

                          </Box>
                        </Grid>
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
                          variant="contained"
                          color="primary"
                          onClick={handleSubmitPos}
                        >
                          Save Changes
                        </Button>
                        <Button onClick={() => setOpen(false)} variant="outlined">
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
    </>
  );
};

export default Pos;
