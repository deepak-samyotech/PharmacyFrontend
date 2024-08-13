import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import CopyToClipboard from "react-copy-to-clipboard";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Input from "@mui/material/Input";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";

import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
};
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
function ManageCustomer() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);
  const [id, setId] = useState([]);

  const columns = [
    { id: "id", label: "ID", align: "center", minWidth: 70 },
    {
      id: "customerName",
      label: "Customer Name",
      align: "center",
      minWidth: 170,
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      align: "center",
      minWidth: 170,
    },
    { id: "customerID", label: "Customer ID", align: "center", minWidth: 170 },
    { id: "type", label: "Type", align: "center", minWidth: 170 },
    { id: "target", label: "Target", align: "center", minWidth: 170 },
    { id: "discount", label: "Discount", align: "center", minWidth: 170 },
    { id: "imageUrl", label: "Image", align: "center", minWidth: 170 },
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/customer");

      const transformedData = response.data?.data?.map((item) => ({
        id: item.id,
        customerName: item.c_name,
        phoneNumber: item.cus_contact,
        customerEmail: item.c_email,
        customerAddress: item.c_address,
        customerID: item.c_id,
        type: item.c_type,
        target: item.target_amount,
        discount: item.regular_discount,
        targetDiscount: item.target_discount,
        pharmacyName: item.pharmacy_name,
        note: item.c_note,
        imageUrl: item.image,
      }));
      setData(transformedData);
      const ids = transformedData.map((item) => item.id);
      setId(ids);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const rows = data;
  //model-->
  const [open, setOpen] = React.useState(false);

  const handleOpen = (row, data) => {
    setEditedRowData(row);
    setOpen(true);
    // Populate input fields with row data
    setCustomerName(row.customerName || "");
    setCustomerContact(row.phoneNumber || "");
    setCustomerEmail(row.customerEmail || "");
    setCustomerAddress(row.customerAddress || "");
    setCustomerType(row.type || "Regular");
    setTargetAmount(row.target || "");
    setRegularDiscount(row.discount || "");
    setTargetDiscount(row.targetDiscount || "");
    setPharmacyName(row.pharmacyName || "");
    setNote(row.note || "");
    setSelectedImage(row.imageUrl || null);
  };

  const handleClose = () => setOpen(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // number input field====================>

  //phone number
  const handleNumberChange = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setCustomerContact(numericInput);
  };
  //target amount
  const handleTargetAmount = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setTargetAmount(numericInput);
  };
  // Regular Discount
  const handleRegularDiscount = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setRegularDiscount(numericInput);
  };
  //target Discount
  const handleTargetDiscount = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setTargetDiscount(numericInput);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = file;
        setSelectedImage(imageUrl);
      } catch (error) {
        console.error("Error creating object URL:", error);
      }
    }
  };

  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerType, setCustomerType] = useState("Regular");
  const [targetAmount, setTargetAmount] = useState("");
  const [regularDiscount, setRegularDiscount] = useState("");
  const [targetDiscount, setTargetDiscount] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [successAlert, setSuccessAlert] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append("c_name", customerName);
      formData.append("cus_contact", customerContact);
      formData.append("c_email", customerEmail);
      formData.append("c_address", customerAddress);
      formData.append("c_type", customerType);
      formData.append("target_amount", targetAmount);
      formData.append("regular_discount", regularDiscount);
      formData.append("target_discount", targetDiscount);
      formData.append("pharmacy_name", pharmacyName);
      formData.append("c_note", note);
      formData.append("image", selectedImage);

      axios
        .put(`http://localhost:8080/customer/${editedRowData.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            // setSuccessAlert(true);
            setOpen(false);
            fetchData();
            toast.success('Data updated Successfully');
          }
        })
        .catch((error) => {
          console.error(`Error updating customer with ID ${id}:`, error);
        });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (customerName.trim() === "") {
      errors.customerName = "Customer name is required";
    }
    if (!customerContact.trim().match(/^\d{10}$/)) {
      errors.customerContact = "Invalid contact number";
    }
    if (customerEmail.trim() === "") {
      errors.customerEmail = "Email is required";
    } else if (!isValidEmail(customerEmail)) {
      errors.customerEmail = "Invalid email address";
    }
    if (customerAddress.trim() === "") {
      errors.customerAddress = "Address is required";
    }
    if (note.trim() === "") {
      errors.note = "Write some note..";
    }
    if (customerType === "Regular") {
      // if (targetAmount.trim() === "") {
      //   errors.targetAmount = "Target amount is required";
      // }
      // if (regularDiscount.trim() === "") {
      //   errors.regularDiscount = "Regular discount is required";
      // }
      // if (targetDiscount.trim() === "") {
      //   errors.targetDiscount = "Target discount is required";
      // }
    } else {
      if (pharmacyName.trim() === "") {
        errors.pharmacyName = "Pharmacy name is required";
      }
    }
    if (!selectedImage) {
      errors.selectedImage = "Image is required";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    return emailRegex.test(email);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    displayImage(file);
  };
  //display image
  const displayImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // navigation
  const navigate = useNavigate();
  const handleButtonClick1 = () => {
    navigate("/customer/add-customer");
  };
  const handleButtonClick2 = () => {
    navigate("/customer/regular-customer");
  };
  const handleButtonClick3 = () => {
    navigate("/customer/wholesale-customer");
  };

  // Function to filter rows based on search term
  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };
  //for age
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  // number input id
  const [trade, setTrade] = useState("");
  const handleNumberChange1 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    setTrade(inputValue);
  };
  const [boxSize, setBoxSize] = useState("");
  const handleNumberChange2 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    setBoxSize(inputValue);
  };
  const [mrp, setMrp] = useState("");
  const handleNumberChange3 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    setMrp(inputValue);
  };
  const [boxPrice, setBoxPrice] = useState("");
  const handleNumberChange4 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    setBoxPrice(inputValue);
  };
  const [quantity, setQuantity] = useState("");
  const handleNumberChange5 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, "");
    setQuantity(inputValue);
  };

  const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, sortedRows.length - page * rowsPerPage);

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const [selectedOption, setSelectedOption] = useState("Regular");

  const handleToggle = () => {
    setSelectedOption((prevOption) =>
      prevOption === "Regular" ? "Wholesale" : "Regular"
    );
  };

  //   buttons-------------------------->
  const handleCopy = () => {
    const tableData = sortedRows
      .map((row) => Object.values(row).join(","))
      .join("\n");
    navigator.clipboard
      .writeText(tableData)
      .then(() => setCopied(true))
      .catch((error) => console.error("Error copying table data: ", error));
  };

  const handleExportCSV = () => {
    const csvData = [
      columns.map((column) => column.label),
      ...sortedRows.map((row) => columns.map((column) => row[column.id])),
    ];
    const csvFile = new Blob([csvData.map((row) => row.join(",")).join("\n")], {
      type: "text/csv",
    });
    const csvUrl = URL.createObjectURL(csvFile);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", "CustomerDetails.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Details");
    XLSX.writeFile(workbook, "CustomerDetails.xlsx");
  };

  // Function to export data to PDF
  const handleExportPDF = () => {
    const columns = [
      "Customer Name",
      "Phone Number",
      "Customer ID",
      "Type",
      "Target",
      "Discount",
    ];
    const rows = sortedRows.map((row) => [
      row.customerName,
      row.phoneNumber,
      row.customerID,
      row.type,
      row.target,
      row.discount,
    ]);

    const doc = new jsPDF();
    doc.text("Customer Details", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("CustomerDetails.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Customer Details</title></head><body>"
    );
    printWindow.document.write("<h1>Customer Details</h1>");
    printWindow.document.write('<table border="1">');
    printWindow.document.write("<thead><tr>");
    columns.forEach((column) => {
      printWindow.document.write(`<th>${column.label}</th>`);
    });
    printWindow.document.write("</tr></thead>");
    printWindow.document.write("<tbody>");
    sortedRows.forEach((row) => {
      printWindow.document.write("<tr>");
      columns.forEach((column) => {
        printWindow.document.write(`<td>${row[column.id]}</td>`);
      });
      printWindow.document.write("</tr>");
    });
    printWindow.document.write("</tbody>");
    printWindow.document.write("</table>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <div style={{ margin: "10px" }}>
        <Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
          <Button
            onClick={handleButtonClick1}
            variant="contained"
            startIcon={<AddIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Add Medicine
          </Button>
          <Button
            onClick={handleButtonClick2}
            variant="contained"
            startIcon={<MenuIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Regular Customer
          </Button>
          <Button
            onClick={handleButtonClick3}
            variant="contained"
            startIcon={<MenuIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Wholesale Customer
          </Button>
        </Stack>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardContent>
            <div className="bg-light">
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <h3>Manage Customer</h3>
                </Grid>
              </Grid>

              <Divider sx={{ borderColor: "blue" }} />
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6} md={8}>
                  <Button
                    variant="outlined"
                    onClick={handleCopy}
                    style={{ margin: "3px", padding: "3px" }}
                  >
                    Copy
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleExportCSV}
                    style={{ margin: "3px", padding: "3px" }}
                  >
                    CSV
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleExportExcel}
                    style={{ margin: "3px", padding: "3px" }}
                  >
                    Excel
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleExportPDF}
                    style={{ margin: "3px", padding: "3px" }}
                  >
                    PDF
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handlePrint}
                    style={{ margin: "3px", padding: "3px" }}
                  >
                    Print
                  </Button>
                </Grid>
                <Grid item xs={6} md={4}>
                  <Input
                    placeholder="Search"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Grid>
              </Grid>

              <div>
                <Paper sx={{ width: "auto", marginTop: "10px" }}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: "auto" }}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">
                            Customer Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Phone Number
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Customer ID
                          </StyledTableCell>
                          <StyledTableCell align="center">Type</StyledTableCell>
                          <StyledTableCell align="center">
                            Target
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Discount
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Image
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Actions
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedRows
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            return (
                              <StyledTableRow key={row.id}>
                                {columns.slice(1).map((
                                  column // Exclude the first column (ID)
                                ) => (
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
                                            maxHeight: "50px",
                                            borderRadius: "50%",
                                          }} // Fixed typo: '50spx' to '50px'
                                        />
                                      ) : (
                                        "no image"
                                      )
                                    ) : (
                                      row[column.id]
                                    )}
                                    {column.id === "actions" ? (
                                      <div
                                        // style={{
                                        //   display: "flex",
                                        //   justifyContent: "center",
                                        //   width: "100px",
                                        //   alignItems: "center",
                                        // }}
                                      >
                                        <IconButton
                                          onClick={() => handleOpen(row)}
                                        >
                                          <EditIcon />
                                        </IconButton>
                                        <IconButton
                                          onClick={() => handlePrint(row.id)}
                                        >
                                          <PrintIcon />
                                        </IconButton>
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </StyledTableCell>
                                ))}
                              </StyledTableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={sortedRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                  />
                </Paper>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
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
                      <h3 className="text-primary">Update Customer</h3>
                    </Grid>
                    <Grid item xs={6} md={2} lg={2}>
                      Wednesday 7th of February 2024 04:37:08 PM
                    </Grid>
                  </Grid>
                  <hr />
                  <div>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            aria-label="customer-type"
                            name="customer-type"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value)}
                          >
                            <FormControlLabel
                              value="Regular"
                              control={<Radio />}
                              label="Regular Customer"
                            />
                            <FormControlLabel
                              value="Wholesale"
                              control={<Radio />}
                              label="Wholesale Customer"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                    {/* Common input fields */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box
                          component="form"
                          sx={{
                            "& .MuiTextField-root": {
                              ml: 1,
                              mt: 2,
                              mr: 1,
                              width: "100%",
                            },
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            id="customerName"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Customer Name"
                            label="Customer Name"
                            multiline
                            size="small"
                            error={!!errors.customerName}
                            helperText={errors.customerName}
                          />

                          <TextField
                            id="cus_contact"
                            label="Phone Number"
                            placeholder="Phone Number"
                            multiline
                            required
                            value={customerContact}
                            onChange={(e) => setCustomerContact(e.target.value)}
                            size="small"
                            error={!!errors.customerContact}
                            helperText={errors.customerContact}
                          />
                          <TextField
                            id="c_email"
                            label="Email"
                            placeholder="Email"
                            multiline
                            value={customerEmail}
                            required
                            size="small"
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            error={!!errors.customerEmail}
                            helperText={errors.customerEmail}
                          />

                          <TextField
                            id="c_address"
                            label="Address"
                            placeholder="Address"
                            multiline
                            value={customerAddress}
                            required
                            size="small"
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            error={!!errors.customerAddress}
                            helperText={errors.customerAddress}
                          />
                          <TextField
                            id="note"
                            label="Note"
                            placeholder="Note"
                            value={note}
                            multiline
                            required
                            size="small"
                            onChange={(e) => setNote(e.target.value)}
                            error={!!errors.note}
                            helperText={errors.note}
                          />
                          <div
                            style={{
                              marginTop: "15px",
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                              border: "1px solid #ccc",
                              width: "100%",
                              padding: "10px",
                              borderRadius: "10px",
                            }}
                          >
                            <input
                              type="file"
                              onChange={handleImageChange}
                              required
                              accept="image/*"
                              style={{ width: "100%" }}
                            />
                            {errors.selectedImage && (
                              <div style={{ color: "red" }}>
                                {errors.selectedImage}
                              </div>
                            )}
                            {selectedImage && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "end",
                                }}
                              >
                                <img
                                  src={selectedImage}
                            // value={imageUrl}
                                  alt="Selected"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "30px",
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </Box>
                      </Grid>

                      {selectedOption === "Regular" && (
                        <Grid item xs={12} md={6}>
                          <Box
                            component="form"
                            sx={{
                              "& .MuiTextField-root": {
                                ml: 1,
                                mt: 2,
                                mr: 1,
                                width: "100%",
                              },
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="targetAmount"
                              label="Target Amount"
                              placeholder="Target Amount"
                              multiline
                              required
                              value={targetAmount}
                              onChange={handleTargetAmount}
                              size="small"
                              error={!!errors.targetAmount}
                              helperText={errors.targetAmount}
                            />
                            <TextField
                              id="regularDiscount"
                              label="Regular Discount"
                              placeholder="Regular Discount"
                              multiline
                              required
                              size="small"
                              value={regularDiscount}
                              onChange={handleRegularDiscount}
                              error={!!errors.regularDiscount}
                              helperText={errors.regularDiscount}
                            />
                            <TextField
                              id="targetDiscount"
                              label="Target Discount"
                              placeholder="Target Discount"
                              multiline
                              required
                              size="small"
                              value={targetDiscount}
                              onChange={handleTargetDiscount}
                              error={!!errors.targetDiscount}
                              helperText={errors.targetDiscount}
                            />
                          </Box>
                        </Grid>
                      )}
                      {selectedOption === "Wholesale" && (
                        <Grid item xs={12} md={6}>
                          <Box
                            component="form"
                            sx={{
                              "& .MuiTextField-root": {
                                ml: 1,
                                mt: 2,
                                mr: 1,
                                width: "100%",
                              },
                            }}
                            noValidate
                            autoComplete="off"
                          >
                            <TextField
                              id="pharmacyName"
                              label="Pharmacy Name"
                              placeholder="Pharmacy Name"
                              multiline
                              required
                              size="small"
                              onChange={(e) => setPharmacyName(e.target.value)}
                              error={!!errors.pharmacyName}
                              helperText={errors.pharmacyName}
                            />
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "15px",
                      }}
                    >
                      <Stack spacing={2} direction="row">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSubmit}
                        >
                          Save Changes
                        </Button>
                        <Button onClick={handleClose} variant="outlined">
                          Cancel
                        </Button>
                      </Stack>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default ManageCustomer;
