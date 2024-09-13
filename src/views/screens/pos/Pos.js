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
  IconButton,
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
import EditIcon from "@mui/icons-material/Edit";
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
import context from "react-bootstrap/esm/AccordionContext";
import { customerLedgerPost, deletePosConfigureData, fetchMedicine, fetchPosConfigured, invoiceDataPost, postPosConfigureData, putPosConfigureData, searchCustomer, searchMedicines, updateProductQuantity } from "utils/api";
import { HttpStatusCodes } from "utils/statusCodes";

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
  const [quantity, setQuantity] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [products, setProducts] = useState("");
  const [customerType, setCustomerType] = useState("Walk_in");
  // post api for customer ledger
  const [paybleAmmount, setPaybleAmmount] = useState("");
  const [paid, setPaid] = useState("");
  const [totalbalance, setTotalbalance] = useState("");
  const [totalDue, setTotalDue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updatedQuantity, setUpdatedQuantity] = useState([]);

  // const [customerId, setCustomerId] = useState("");
  //post for invoice
  const [data3, setData3] = useState([]);

  //pos 
  const [posValue, setPosValue] = useState("");



  const [newValue, setNewValue] = useState("");
  const [newQuantity, setNewQuantity] = useState("1");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [editedRowData, setEditedRowData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const [customerLedger, setCustomerLedger] = useState();
  const [generatedInvoiceId, setGeneratedInvoiceId] = useState();
  const [isGenerateInvoice, setIsGenerateInvoice] = useState(false);


  console.log("newquantity==========================>>>>>>>", newQuantity)

  const fetchMedicineData = async () => {
    const response = await fetchMedicine();


    if (response?.status === HttpStatusCodes.OK) {
      const transformedData = response?.data?.data?.map((item) => ({
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
    }
  };

  const searchMedicinesData = async () => {
    try {
      const medicineResponse = await searchMedicines(posValue, searchTerm)
  
      console.log("medicineResponse : ", medicineResponse);
  
      if (medicineResponse?.status === HttpStatusCodes.OK) {
        if (medicineResponse?.data?.status === false) {
          toast.error("Not found!");
          setSearchTerm("");
          return;
        }
        setMedicines(medicineResponse?.data?.medicines);
  
        setProduct_id(medicineResponse?.data?.medicines?.product_id);
      }
    } catch (error) {
      console.log("Error ", error);
      toast.error("something went wrong");
    }
  };

  const searchCustomerData = async () => {
    const customerResponse = await searchCustomer(cus_contact, searchTerms);
    const customerData = customerResponse?.data?.customer;
    const customerType = customerData.length > 0 ? customerData[0].c_type : "Walk_in";

    setCustomer(customerData);
    setCustomerType(customerType);
    const disc = customerData.length > 0 ? customerData[0]?.regular_discount : 0;
    setDiscount(disc);
    console.log("discount : ", disc);
  };

  useEffect(() => {

    if (searchTerm && posValue) {
      setTimeout(() => {
        searchMedicinesData();
      }, 1000);
    } else {
      setMedicines([]);
    }

    if (searchTerms && cus_contact) {
      setTimeout(() => {
        searchCustomerData();
      }, 1000);
    } else {
      setCustomer([]);
    }

    fetchMedicineData();
  }, [searchTerm, posValue, searchTerms, cus_contact]);

  // console.error("setMedicines:", medicines);

  const handleChange = (event) => {
    setQuantity(1);
    setSearchTerm(event.target.value);
    setPosValue(event.target.value);
  };
  const handleChange1 = (event) => {
    setSearchTerms(event.target.value);
    setCus_contact(event.target.value);
  };

  const handleQuantityChange = (event) => {
    let val = parseInt(event.target.value, 10);

    if (val < 1) val = 1;
    if (val > 100) val = 100;

    setQuantity(val);
  };



  const medicineList = tableData.map((item) => item.productName);
  const qty = tableData.map((item) => item.quantity);
  const product_total = tableData.map((item) => item.total);

  const customerName = customer.map((item) => item.c_name);
  const contact = customer.map((item) => item.cus_contact);
  const cusType = customer.map((item) => item.c_type);
  const customerId = customer.map((item) => item.c_id);


  const handleAddToTable = () => {
    // const selectedMedicine = medicines.find(
    //   (medicine) => medicine.product_id === product_id
    // );
    if (quantity <= 0 || medicines.length <= 0) {
      toast.error("Empty Quantity or Products");
      return;
    }

    if (quantity > medicines[0]?.instock) {
      toast.error("Insufficient Stock");
      return;
    }

    const isPresent = tableData.some((data) => data?.p_id === medicines[0]?._id);
    if (isPresent) {
      toast.warning("This Product is already added");
      return;
    }

    if (medicines) {

      const total = parseFloat(medicines[0]?.mrp) * parseFloat(quantity);
      const newData = {
        p_id: medicines[0]?._id,
        productName: medicines[0]?.product_name,
        quantity: quantity,
        total: total.toFixed(2),
        genericName: medicines[0]?.generic_name, // Add generic name to newData
        medMrp: medicines[0]?.mrp, // Add MRP to newData
        discount: medicines[0]?.w_discount, // Add discount to newData
        inStockQuantity: medicines[0]?.instock
      };

      console.log("New Table data : ", newData);

      setTableData([...tableData, newData]);

      const productNewQuantityObj = {
        _id: newData.p_id,
        ProductNewQuantity: medicines[0]?.instock - quantity
      };

      setUpdatedQuantity(prevData => [...prevData, productNewQuantityObj]);

      setPosValue("");
      setQuantity(1);
      setSearchTerm("");
    }
  };

  // post api for customer ledger & invoice
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Disable the button

    if (tableData.length <= 0) {
      toast.error("At least one product is needed to generate an invoice");
      setIsLoading(false); // Re-enable the button
      return;
    }

    if (!searchTerms) {
      toast.error("Customer Phone needed");
      setIsLoading(false); // Re-enable the button
      return;
    }

    if (!paid) {
      toast.error("There need to be some amount paid");
      setIsLoading(false);
      return;
    }

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
    formDataManageInvoice.append("contact", searchTerms);
    formDataManageInvoice.append("customerType", customerType);
    formDataManageInvoice.append(
      "createDate",
      new Date().toISOString().split("T")[0]
    );

    // Map tableData to construct medicineData array
    const medicineData = tableData.map((item) => ({
      medicine_id: item.p_id,
      medicine: item.productName,
      qty: item.quantity,
      product_total: item.total,
      genericName: item.genericName,
      medMrp: item.medMrp,
      discount: item.discount,
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

    // Make the first API call
    const customerLedgerResponse = await customerLedgerPost(formDataCustomerLedger);

    if (customerLedgerResponse?.status === HttpStatusCodes.OK) {
      setCustomerLedger(customerLedgerResponse?.data?.newCustomer_ledger)
      console.log("Customer ledger saved successfully", customerLedgerResponse);
    }

    // Make the second API call inside finally block of first one to chain the execution
    const invoiceResponse = await invoiceDataPost(formDataManageInvoice);

    if (invoiceResponse.status === HttpStatusCodes.OK) {
      console.log("response.data.newManage_Invoice : ", invoiceResponse?.data?.newManage_Invoice);

      setGeneratedInvoiceId(invoiceResponse?.data?.newManage_Invoice._id);
      setTableData([]); // Clear table data after successful save
      setSearchTerms("");
      setPaid("");
      setCustomerType("Walk_in");
    }


    // Make the third API call inside finally block of second one to chain the execution
    const updateProdQResponse = await updateProductQuantity(updatedQuantity);

    if (updateProdQResponse.status === HttpStatusCodes.OK) {
      toast.success("Order Sold Successfully.");
      setOpen3(true);
      setUpdatedQuantity([]);
    }
   
    setIsLoading(false); // Re-enable the button after all API calls

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
    if (totalAmount) {
      // const regularDiscount = parseFloat(customer[0].regular_discount || discount);
      const regularDiscount = discount;
      console.log(":Discount :: ", regularDiscount);
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
    console.log("TableData : ", tableData);
    const updatedTableData = [...tableData];
    updatedTableData.splice(index, 1);
    setTableData(updatedTableData);

    // delete product new Qunatity also
    const newQuantityData = [...updatedQuantity];
    newQuantityData.splice(index, 1);
    setUpdatedQuantity[newQuantityData];
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

  const handleGenerateInvoice = () => {

    navigate(`/manage_invoice/${generatedInvoiceId}`);
  };

  //current date & time
  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });

  // Pos section functionality
  const [posData, setPosData] = useState([]);
  const [open, setOpen] = useState(false);
  const [posId, setPosId] = useState("");

  const [posConfigData, setPosConfigData] = useState([]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
  };

  const fetchPosData = async () => {
    const response2 = await fetchPosConfigured();

    setPosConfigData(response2.data.filteredData);
  }

  const fetchPosConfiguredData = async () => {
    try {

      const response = await fetchMedicine();

      fetchPosData();

      // if (!(response.data.data.length > 0)) {
      //   toast.warning("There is no Product to Configure");
      //   setOpen(false);
      //   return;
      // }

      const filteredData = response.data.data.filter(item => item.posStatus === false);

      console.log("filterdata -> ", filteredData);

      // if (!(filteredData.length > 0)) {
      //   setOpen(false);
      //   toast.warning("All product values are configured.");
      // }

      setPosData(filteredData);

    } catch (error) {
      console.log(error);
      toast.error("Not able to open modal");
    }
  }

  const handleOpen = async () => {

    setOpen(true);
    fetchPosConfiguredData();
  }

  const handleSubmitPos = async () => {

    try {
      const response = await postPosConfigureData(posId,posValue)
      
          if (response.status === 200) {
            setOpen(false);
            setPosId("");
            setPosValue("");
            toast.success("Configuration saved Successfully");
          }
    } catch (error) {
      console.error("Error:", error);
      const errMessage = error.response.data.error;
      toast.error(errMessage);
    }
  }


  const handleClose1 = () => {
    setOpen1(false);
    setNewValue("");
  }

  const handleClose2 = () => {
    setOpen2(false);

  }

  const handleClose3 = () => {
    setOpen3(false);
  }

  const handleOpen1 = (row) => {
    console.log("Row = ", row);
    setEditedRowData(row);
    setOpen1(true);

    setNewValue(row.value)
  }

  const handleOpen2 = (index) => {
    setOpen2(true);
    setEditIndex(index);

  }

  const handlePosConfigureEditSubmit = async () => {
      try {
        const response = await putPosConfigureData(editedRowData.id, newValue);

        console.log("response ------===", response);
    
          if (response.status === 200) {
            setOpen1(false);
            setEditedRowData(null);
            setNewValue("");
            fetchPosData();
            toast.success("Value updated Successfully");
          }
      } catch (error) {
        console.error("Error:", error);
        const errMessage = error.response.data.error;
        toast.error(errMessage);
      }
  }

  const handleEdit2Submit = () => {
    const updatedTableData = [...tableData];
    let newQuantityData = [...updatedQuantity];


    if (newQuantity) {

      if (updatedTableData[editIndex].inStockQuantity - newQuantity < 0) {
        toast.error("Insufficient stock");
        return;
      }

      updatedTableData[editIndex].quantity = newQuantity;
      newQuantityData[editIndex].ProductNewQuantity = updatedTableData[editIndex].inStockQuantity - newQuantity;

      updatedTableData[editIndex].total = updatedTableData[editIndex].medMrp * parseFloat(newQuantity);

      setTableData(updatedTableData);
      setUpdatedQuantity(newQuantityData);

      setPaybleAmmount(calculatePayable());
      setTotalbalance(calculateTotal());

      toast.success("Quantity Updated");
      setOpen2(false);
      setNewQuantity(1);
    }
    else {
      toast.error("new Quantity needed");
    }
  }


  const handlePosConfigureDeleteClick = async (id) => {
    try {
      const response = await deletePosConfigureData(id)
        
          if (response.status === 200) {
            fetchPosData();
            fetchPosConfiguredData();
            toast.warning("Data deleted Successfully");
          }
     
    } catch (error) {
        console.error("Error:", error);
        const errMessage = error.response.data.error;
        toast.error(errMessage);
    }
  }

  // ---------------Add product-------------------------------
  const [customerAndInvoiceDetails, setCustomerAndInvoiceDetails] = useState([
    {
      customer_id: '',
      customer_name: '',
      contact: '',
      customer_type: '',
      create_date: '',
      total_balance: '',
      total_paid: '',
      total_due: '',
      product_name: '',
      quantity: '',
      medicine_mrp: ''
    }
  ])

  const handleAddProduct = () => {
    customerAndInvoiceDetails.push(
      {
        customer_id: customer?.c_id,
        customer_name: customer?.c_name,
        contact: searchTerms,
        customer_type: customerType,
        product_name: medicines?.product_name,
        medicine_mrp: medicines?.mrp,
        quantity: quantity,
        total_balance: '',
        total_paid: paid,
        total_due: calculateDue()
      }
    )
  }

  const handleRadioButton = (event) => {
    setCustomerType(event.target.value);
    setSearchTerms("");
    setCus_contact("");
    setCustomer([]);
    setSearchTerm("");
    setPosValue("");
    setMedicines([]);
    setQuantity(1);

  }

  useEffect(() => {
    setPaybleAmmount(calculatePayable());
    setTotalbalance(calculateTotal());
  }, [discount, tableData.length]);

  const handleNewQuantityChange = (event) => {
    console.log(event)
    if (event.target.value == NaN) {
      setNewQuantity(0)
    }
    let val = parseInt(event.target.value, 10);

    if (val < 1) val = 1;
    if (val > 100) val = 100;

    setNewQuantity(val);
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
                        // defaultValue="Walk_in"
                        // onChange={(event) => setCustomerType(event.target.value)}
                        onChange={(event) => handleRadioButton(event)}
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
                    {/* <Button
                      onClick={handleButtonClick2}
                      variant="contained"
                      size="small"
                      startIcon={<MenuIcon />}
                      style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
                    >
                      Generate Invoice
                    </Button> */}
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
                {customer?.map((customer, index) => (
                  <>
                    {/* Customer Name TextField */}
                    <Grid item xs={12} md={2} key={index}>
                      <TextField
                        label="Customer Name"
                        fullWidth
                        size="small"
                        value={customer?.c_name}
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
                        value={customer?.c_id}
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
                    label="POS Value"
                    placeholder="Enter POS Value"
                    fullWidth
                    size="small"
                    value={searchTerm}
                    onChange={handleChange}
                    sx={{ mr: 1 }}
                    onKeyDown={(event) => {
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
                </Grid>
                {medicines.map((medicine, index) => (
                  <>
                    <Grid item xs={12} md={2} key={index}>
                      <TextField
                        label="Product Name"
                        fullWidth
                        size="small"
                        sx={{ mr: 1 }}
                        value={medicine?.product_name}
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
                        value={medicine?.generic_name}
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
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={handleQuantityChange}
                    sx={{ mr: 1 }}

                    onKeyDown={(event) => {
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
                      inputProps: {
                        min: 1,
                        max: 100
                      }
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
                        value={medicine?.mrp}
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
                        value={medicine?.instock}
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
              <Button
                variant="contained"
                color="primary"
                // onClick={handleAddProduct}
                onClick={handleAddToTable}
                style={{ margin: "5px" }}
              >
                Add Product
              </Button>

              <Grid container spacing={4} sx={{ marginBottom: "20px", }}>
                {/* First Table */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead sx={{ backgroundColor: "white" }}>
                          <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody sx={{ zIndex: "-10" }} >
                          {tableData?.map((item, index) => (
                            <TableRow key={index} >
                              <TableCell>{item?.productName}</TableCell>
                              <TableCell>{item?.quantity}</TableCell>
                              <TableCell>{item?.total}</TableCell>
                              {/* <TableCell>
                                <Fab aria-label="edit">
                                  <EditIcon
                                    onClick={() => handleRemoveProduct(index)}
                                  />
                                </Fab>
                              </TableCell> */}
                              <TableCell>
                                <Fab aria-label="edit">
                                  <EditIcon
                                    onClick={() => handleOpen2(index)}
                                    sx={{ marginRight: "15px" }}
                                  />
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
                        value={totalbalance}
                        // onChange={(event) => handleTotalAmountChange(event.target.value)}
                        size="small"
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      {/* Discount Field */}
                      {customer?.map((customer, index) => (
                        <TextField
                          key={index}
                          label="Discount"
                          type="number"
                          size="small"
                          value={discount}
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
                        value={paybleAmmount}
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
                              {data3?.map((item, index) => (
                                <ListItem key={index}>
                                  <ListItemAvatar>
                                    <Avatar
                                      alt="logo"
                                      src={item?.image}
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
                                          {item?.medicineName}
                                        </Typography>
                                        <br />
                                        <Typography
                                          component="span"
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          {item?.genericName}
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
                                          Exp Date: {item?.expDate}
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
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
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
                    <TableContainer component={Paper} sx={{maxHeight:400}}>
                      <Table sx={{ minWidth: 600}} stickyHeader aria-label="scrollable table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Configured Product Name</TableCell>
                            <TableCell align="right">Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {posConfigData?.map((row) => (
                            <TableRow
                              key={row.id}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              {/* <TableCell align="right">{row.id}</TableCell> */}
                              <TableCell component="th" scope="row">
                                {row?.productName}
                              </TableCell>
                              <TableCell align="right">{row?.value}</TableCell>
                              <TableCell align="right">
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleOpen1(row)}
                                  style={{ marginRight: "5px" }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() => handlePosConfigureDeleteClick(row.id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
                                  {posData?.map((medData) => (
                                    <MenuItem
                                      key={medData?.id}
                                      value={medData?.id}
                                    >
                                      {medData?.product_name}
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
                          Save
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

        <Modal
          open={open1}
          onClose={handleClose1}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description">
              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardContent>
                  <div className="bg-light">
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
                            <TextField
                              multiline
                              fullWidth
                              value={newValue}
                              label="New Value"
                              onChange={(e) => setNewValue(e.target.value)}
                              variant="outlined"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                    {/* <hr /> */}
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
                          onClick={handlePosConfigureEditSubmit}
                        >
                          Save Changes
                        </Button>
                        <Button onClick={handleClose1} variant="outlined">
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

        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description">
              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardContent>
                  <div className="bg-light">
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
                          // width={500}
                          >
                            <TextField


                              type="number"
                              value={newQuantity}
                              label="New Quantity"
                              onChange={handleNewQuantityChange}
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocalMallIcon />
                                  </InputAdornment>
                                ),
                                inputProps: {
                                  min: 1,
                                  max: 100
                                }
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                    {/* <hr /> */}
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
                          onClick={handleEdit2Submit}
                        >
                          Save Changes
                        </Button>
                        <Button onClick={handleClose2} variant="outlined">
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

        <Modal
          open={open3}
          onClose={handleClose3}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description">
              <Card style={{ backgroundColor: "#ffffff" }}>
                <CardContent>
                  <div className="bg-light">
                    <Typography
                      variant="h3"
                      sx={{ textAlign: "center" }}
                    >
                      Do you want to generate Invoice ?
                    </Typography>
                    {/* <hr /> */}
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
                          onClick={handleGenerateInvoice}
                        >
                          Yes
                        </Button>
                        <Button onClick={handleClose3} variant="outlined">
                          No
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
