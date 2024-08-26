/*eslint-disable*/
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
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
import { useNavigate } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import Input from "@mui/material/Input";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./manageMedicine.css";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

import { ToastContainer, toast } from 'react-toastify';

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

function ManageMedicine() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const columns = [
    // { id: 'id', label: 'ID', align: 'start', minWidth: 70 },
    {
      id: "medicineName",
      label: "Medicine Name",
      align: "start",
      minWidth: 170,
    },
    { id: "genericName", label: "Generic Name", align: "start", minWidth: 170 },
    { id: "form", label: "Form", align: "start", minWidth: 170 },
    { id: "company", label: "Company", align: "start", minWidth: 170 },
    { id: "expDate", label: "Expiry Date", align: "start", minWidth: 170 },
    { id: "barcode", label: "Barcode", align: "start", minWidth: 170 },
    { id: "mrp", label: "M.R.P.", align: "start", minWidth: 170 },
    { id: "imageUrl", label: "Image", align: "start", minWidth: 170 },
    { id: "actions", label: "Actions", align: "start", minWidth: 170 },
  ];

  const [companyName, setCompanyName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [strength, setStrength] = useState("");
  const [tradePrice, setTradePrice] = useState("");
  const [boxSize, setBoxSize] = useState("");
  const [expDate, setExpDate] = useState("");
  const [sideEffect, setSideEffect] = useState("");
  const [productName, setProductName] = useState("");
  const [barcodeNum, setBarcodeNum] = useState("");
  const [mrp, setMrp] = useState("");
  const [boxPrices, setBoxPrices] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ShortQty, setShortQty] = useState("");
  const [form, setForm] = useState("");
  const [selectedOption, setSelectedOption] = useState("Yes");
  const [discountType, setDiscountType] = useState("Yes"); // Add this line
  const [supplierList, setSupplierList] = useState([]); // State to store the list of suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(""); // State to store the selected supplier
  const [errors, setErrors] = useState({});
  const [id, setId] = useState([]);

  const handleBoxPriceCalculation = () => {
    // Calculate box price based on MRP and box size
    const calculatedBoxPrice = parseFloat(mrp) * parseInt(boxSize);
    setBoxPrices(calculatedBoxPrice.toFixed(2)); // Set the box price
  };


  const fetchData = async () => {
    try {
      // Fetch medicine data
      const responseMedicine = await axios.get(
        "http://localhost:8080/medicine"
      );
      console.log("medicine response: ", responseMedicine)
      const transformedDataMedicine = responseMedicine.data?.data?.map(
        (item) => ({
          id: item.id,
          medicineName: item.product_name,
          genericName: item.generic_name,
          form: item.form,
          company: item.supplier_name,
          expDate: item.expire_date,
          barcode: item.barcode,
          mrp: item.mrp,

          strength: item.strength,
          tradePrice: item.trade_price,
          boxSize: item.box_size,
          sideEffect: item.side_effect,
          boxPrices: item.box_price,
          quantity: item.instock,
          ShortQty: item.short_stock,
          formValue: item.form,

          imageUrl: item.image,
        })
      );



      console.log("transformedDataMedicine : ", transformedDataMedicine);
      // Log and set medicine data
      const ids = transformedDataMedicine.map((item) => item.id);
      setData(transformedDataMedicine);
      setId(ids);

      // Fetch supplier data
      const responseSupplier = await axios.get(
        "http://localhost:8080/medicine/s-data/:data"
      );
      // Check the structure of response.data
      const supplierDataList = responseSupplier.data.data.suppliers;

      // Assuming data is in the form of { data: [{ s_id, s_name }, ...] }
      const transformedSupplierData = supplierDataList.map((item) => ({
        supplier_id: item.suppler_Id,
        supplier_name: item.supplier_name,
      }));

      // Update state only if transformedData is an array
      if (Array.isArray(transformedSupplierData)) {
        setSupplierList(transformedSupplierData);
      } else {
        console.error(
          "Data is not in the expected format:",
          transformedSupplierData
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    handleBoxPriceCalculation(); // Call the calculation function whenever MRP or box size changes
  }, [mrp, boxSize]);
  const rows = data;

  //for age
  const [age, setAge] = useState("");
  const [formValue, setFormValue] = useState("");

  const handleChange = (event) => {
    setFormValue(event.target.value); // Update formValue state
    setForm(event.target.value); // Update form state
  };
  // number input field====================>
  //Trade Price
  const handleTradePrice = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setTradePrice(numericInput);
  };
  //Box Size
  const handleBoxSize = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setBoxSize(numericInput);
  };
  //Barcode number
  const handleBarcode = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setBarcodeNum(numericInput);
  };
  //MRP
  const handleMrp = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setMrp(numericInput);
  };
  //Box price
  const handleBoxPrice = (e) => {
    const input = e.target.value;
    // const numericInput = input.replace(/\D/g, "");
    const calculatedBoxPrice = parseFloat(mrp) * parseInt(boxSize);
    setBoxPrices(calculatedBoxPrice.toFixed(2)); // Set the box price

  };

  // Qty
  const handleQuantity = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setQuantity(numericInput);
  };
  //Short Qty
  const handleShortQty = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setShortQty(numericInput);
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
  //checkbox
  const [isChecked, setIsChecked] = useState(false);

  const handleChangeCB = () => {
    setIsChecked(true);
  };

  // navigation
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/medicine/add-medicine");
  };
  const linkStyles = {
    color: "#2196f3",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value); // Update the selected supplier state
    setCompanyName(event.target.value); // Set the selected supplier as the company name
  };
  const [open, setOpen] = React.useState(false);

  const handleOpen = (row) => {
    setEditedRowData(row);
    setOpen(true);

    console.log("Row : ", row );
    // Populate the modal fields with the data of the selected row
    setGenericName(row.genericName);
    setStrength(row.strength);
    setTradePrice(row.tradePrice);
    setBoxSize(row.boxSize);
    setExpDate(row.expDate);
    setSideEffect(row.sideEffect);
    setProductName(row.medicineName);
    setBarcodeNum(row.barcode);
    setMrp(row.mrp);
    // setBoxPrices(row.boxPrice);
    setQuantity(row.quantity);
    setShortQty(row.ShortQty);
    setForm(row.form);
    setSelectedOption(row.discountType);
    setSelectedSupplier(row.company);

    // If you have an image URL, you might want to set it to selectedImage as well
    setSelectedImage(row.imageUrl || null);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("supplier_name", companyName);
    formData.append("generic_name", genericName);
    formData.append("strength", strength);
    formData.append("trade_price", tradePrice);
    formData.append("box_size", boxSize);
    formData.append("expire_date", expDate);
    formData.append("side_effect", sideEffect);
    formData.append("product_name", productName);
    formData.append("barcode", barcodeNum);
    formData.append("mrp", mrp);
    formData.append("box_price", boxPrices);
    formData.append("instock", quantity);
    formData.append("short_stock", ShortQty);
    formData.append("form", form);
    formData.append("discount", discountType);
    formData.append("image", selectedImage);

    axios
      .put(`http://localhost:8080/medicine/${editedRowData.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Look at data = ",response);
        if (response.status === 200) {
          console.log("I am here");
          fetchData();
          setOpen(false);
          toast.success('Data updated Successfully');
        }
      })
      .catch((error) => {
        console.error(`Error updating medicine with ID ${id}:`, error);
      });
  };

  // const handleEdit = (rowData) => {
  //   setSelectedRow(rowData);
  //   handleOpen(); // Open modal
  // };

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
    link.setAttribute("download", "productDetails.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Details");
    XLSX.writeFile(workbook, "productDetails.xlsx");

    // Create Excel file
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const excelUrl = URL.createObjectURL(excelFile);
  };


  // Function to export data to PDF
  const handleExportPDF = () => {
    const columns = [
      "Medicine Name",
      "Generic Name",
      "Form",
      "Company",
      "Expiry Date",
      "M.R.P.",
      "Barcode",
    ];
    const rows = sortedRows.map((row) => [
      row.medicineName,
      row.genericName,
      row.form,
      row.company,
      row.expDate,
      row.mrp,
      row.barcode,
    ]);

    const doc = new jsPDF();
    doc.text("Product Details", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("productDetails.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Product Details</title></head><body>"
    );
    printWindow.document.write("<h1>Product Details</h1>");
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
      <div>
        <Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
          <Button
            onClick={handleButtonClick}
            variant="contained"
            startIcon={<AddIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Add Medicine
          </Button>
        </Stack>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <div style={{ margin: "10px" }}>
            <div className="bg-light">
              <Stack
                container
                spacing={2}
                direction="row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <Typography xs={6} md={10} lg={10}>
                  <h3> Manage Medicine</h3>
                </Typography>
              </Stack>
              <Divider sx={{ borderColor: "#2196f3", marginBottom: "10px" }} />
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
                <div>
                  <Paper sx={{ width: "auto", marginTop: "10px" }}>
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: "auto" }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow>
                            {/* <StyledTableCell align='center'>ID</StyledTableCell> */}
                            <StyledTableCell align="center">
                              medicine Name
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Generic Name
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Form
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Company
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Expiry Date
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Barcode
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              M.R.P.
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
                                      ) : (
                                        row[column.id]
                                      )}
                                      {column.id === "actions" ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            width: "100px",
                                            alignItems: "center",
                                          }}
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
            </div>
          </div>
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
                      <h3 className="text-primary">Update Medicine</h3>
                    </Grid>
                    <Grid item xs={6} md={2} lg={2}>
                      Wednesday 7th of February 2024 04:37:08 PM
                    </Grid>
                  </Grid>
                  <hr />
                  <div style={{ marginBottom: "20px" }}>
                    <Grid container spacing={2}>
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
                            <FormControl size="small" fullWidth multiline>
                              <InputLabel id="companyName-label">
                                Company Name
                              </InputLabel>
                              <Select
                                id="companyName"
                                value={selectedSupplier}
                                onChange={handleSupplierChange}
                                label="Company Name"
                                placeholder="supplier Name"
                              >
                                {supplierList.map((supplier) => (
                                  <MenuItem
                                    key={supplier.supplier_id}
                                    value={supplier.supplier_name}
                                  >
                                    {supplier.supplier_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <TextField
                            size="small"
                            id="generic_name"
                            required
                            value={genericName}
                            onChange={(e) => setGenericName(e.target.value)}
                            label="Generic Name"
                            placeholder="Generic Name"
                            multiline
                          />
                          <TextField
                            size="small"
                            id="strength"
                            required
                            label="Strength"
                            placeholder="Strength"
                            value={strength}
                            onChange={(e) => setStrength(e.target.value)}
                            multiline
                          />
                          <TextField
                            size="small"
                            label="Trade Price"
                            id="trade_price"
                            placeholder="Trade Price"
                            multiline
                            required
                            value={tradePrice}
                            onChange={handleTradePrice}
                            fullWidth
                          />
                          <TextField
                            size="small"
                            label="Box Size"
                            id="boxSize"
                            placeholder="Box Size"
                            multiline
                            required
                            value={boxSize}
                            onChange={handleBoxSize}
                            fullWidth
                          />
                          <TextField
                            size="small"
                            id="expiry-date"
                            label="Expiry Date"
                            value={expDate}
                            type="date"
                            onChange={(e) => setExpDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            size="small"
                            id="outlined-textarea"
                            value={sideEffect}
                            label="Side Effect"
                            placeholder="Side Effect"
                            onChange={(e) => setSideEffect(e.target.value)}
                            multiline
                          />
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
                          Validate
                          autoComplete="off"
                        >
                          <TextField
                            size="small"
                            id="outlined-textarea"
                            label="Product Name"
                            placeholder="Product Name"
                            multiline
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                          />
                          <TextField
                            size="small"
                            id="barcodeNum"
                            multiline
                            required
                            value={barcodeNum}
                            onChange={handleBarcode}
                            fullWidth
                            label="Barcode Number"
                            placeholder="Barcode Number"
                          />
                          <TextField
                            size="small"
                            label="M.R.P."
                            id="mrp"
                            multiline
                            required
                            value={mrp}
                            onChange={handleMrp}
                            fullWidth
                            placeholder="M.R.P."
                          />
                          <TextField
                            label="Box Pirce"
                            multiline
                            required
                            value={boxPrices}
                            size="small"
                            id="boxPrices"
                            onChange={handleBoxPrice}
                            fullWidth
                            placeholder="Box Pirce"
                            error={!!errors.boxPrices}
                            helperText={errors.boxPrices}
                          />
                          <TextField
                            size="small"
                            label="Quantity"
                            id="Quantity"
                            multiline
                            required
                            value={quantity}
                            onChange={handleQuantity}
                            fullWidth
                            placeholder="Short Quantity"
                          />
                          <TextField
                            size="small"
                            label="Short Quantity"
                            id="ShortQty"
                            multiline
                            required
                            value={ShortQty}
                            onChange={handleShortQty}
                            fullWidth
                            placeholder="Short Quantity"
                          />
                          <Grid item>
                            <FormControl size="small" fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Form
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={form}
                                onChange={handleChange} // Update onChange event to handleChange
                                label="formValue"
                              >
                                <MenuItem value={"tablet"}>Tablet</MenuItem>
                                <MenuItem value={"capsule"}>Capsule</MenuItem>
                                <MenuItem value={"injection"}>
                                  Injection
                                </MenuItem>
                                <MenuItem value={"eyeDrop"}>Eye Drop</MenuItem>
                                <MenuItem value={"suspension"}>
                                  Suspension
                                </MenuItem>
                                <MenuItem value={"cream"}>Cream</MenuItem>
                                <MenuItem value={"saline"}>Saline</MenuItem>
                                <MenuItem value={"inhaler"}>Inhaler</MenuItem>
                                <MenuItem value={"power"}>Power</MenuItem>
                                <MenuItem value={"spray"}>Spray</MenuItem>
                                <MenuItem value={"paediatricDrop"}>
                                  Paediatric Drop
                                </MenuItem>
                                <MenuItem value={"nebuliserSolution"}>
                                  Nebuliser Solution
                                </MenuItem>
                                <MenuItem value={"powerForSuspension"}>
                                  Power for Suspension
                                </MenuItem>
                                <MenuItem value={"nasalDrop"}>
                                  Nasal Drops
                                </MenuItem>
                                <MenuItem value={"eyeOintment"}>
                                  Eye Ointment
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
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
                              // value={selectedImage}
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
                                  // src={URL.createObjectURL(selectedImage)}
                                  src={selectedImage}
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
                    </Grid>
                    <Grid container spacing={2}>
                      {/* First Column */}
                      <Grid item xs={12} md={6}>
                        <FormControlLabel
                          className=""
                          control={
                            <Checkbox
                              icon={
                                <span
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    border: "2px solid #000",
                                    borderRadius: "3px",
                                  }}
                                />
                              }
                              checkedIcon={
                                <span
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  ✓
                                </span>
                              }
                              checked={isChecked}
                              onChange={handleChangeCB}
                              disabled={isChecked}
                              name="addToFavourite"
                            />
                          }
                          label="Add to Favourite"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            aria-label="discount-type"
                            name="discount-type"
                            value={selectedOption}
                            required
                            onChange={(e) => setDiscountType(e.target.value)}
                          >
                            <h4 style={{ margin: "10px", marginTop: "12px" }}>
                              Discount
                            </h4>
                            <FormControlLabel
                              onClick={() => setSelectedOption("Yes")}
                              variant={
                                selectedOption === "Yes"
                                  ? "contained"
                                  : "outlined"
                              }
                              value="Yes"
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              onClick={() => setSelectedOption("No")}
                              variant={
                                selectedOption === "No"
                                  ? "contained"
                                  : "outlined"
                              }
                              value="No"
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </div>
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
              </CardContent>
            </Card>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default ManageMedicine;
