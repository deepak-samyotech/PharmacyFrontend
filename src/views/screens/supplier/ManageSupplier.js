/*eslint-disable*/
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
import Fab from "@mui/material/Fab";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import CopyToClipboard from "react-copy-to-clipboard";
import CSVDownload from "react-csv";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import Input from "@mui/material/Input";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { strengthColor } from "utils/password-strength";
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

function ManageSupplier() {
  //  ------------------------row-page------------------
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);

  const [supplierName, setSupplierName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const columns = [
    { id: "supplierId", label: "supplier ID", align: "center", minWidth: 170 },
    {
      id: "supplierName",
      label: "Supplier Name",
      align: "center",
      minWidth: 170,
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      align: "center",
      minWidth: 170,
    },
    { id: "address", label: "Address", align: "center", minWidth: 170 },
    { id: "imageUrl", label: "Image", align: "center", minWidth: 170 },
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/supplier");
      const transformedData = response.data?.data?.map((item) => ({
        id: item.id,
        supplierId: item.s_id,
        supplierName: item.s_name,
        phoneNumber: item.s_phone,
        address: item.s_address,
        email: item.s_email,
        status: item.status,
        note: item.s_note,
        imageUrl: item.image,
      }));
      setData(transformedData);
      const ids = transformedData.map((item) => item.id);
      setData(transformedData);
      setId(ids);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  //models
  const [open, setOpen] = React.useState(false);
  const handleOpen = (row) => {
    console.log("Row = ", row);
    setEditedRowData(row);
    setOpen(true);

    // console.log("editedRow", editedRowData);

    setSupplierName(row.supplierName);
    setEmail(row.email);
    setNote(row.note);
    setStatus(row.status);
    setPhoneNumber(row.phoneNumber);
    setAddress(row.address)
    setSelectedImage(row.selectedImage)
  };
  const handleClose = () => setOpen(false);
  
  //PUT Api calling
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (validateForm()) {
    const formData = new FormData();
    formData.append("s_name", supplierName);
    formData.append("s_email", email);
    formData.append("s_note", note);
    formData.append("s_phone", phoneNumber);
    formData.append("s_address", address);
    formData.append("status", status);
    formData.append("image", selectedImage);


    axios
      .put(`http://localhost:8080/supplier/${editedRowData.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // setSuccessAlert(true);
          setOpen(false);
          fetchData();
          toast.success("Data updated Successfully");
        }
      })
      .catch((error) => {
        console.error(`Error updating customer with ID ${id}:`, error);
      });
    // }
  };

  const rows = data;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //phone number

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const [copied, setCopied] = useState(false);
  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  // navigation
  const navigate = useNavigate();
  const handleButtonClick1 = () => {
    navigate("/supplier/add-supplier");
  };
  const handleButtonClick2 = () => {
    navigate("/account/supplier-balance");
  };

  const filteredRows = data.filter((row) =>
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
    link.setAttribute("download", "SupplierDetails.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Supplier Details");
    XLSX.writeFile(workbook, "SupplierDetails.xlsx");
  };

  // Function to export data to PDF
  const handleExportPDF = () => {
    const columns = [
      "Supplier ID",
      "Supplier Name",
      "Phone Number",
      "Address",

    ];
    const rows = sortedRows.map((row) => [
      row.supplierId,
      row.supplierName,
      row.phoneNumber,
      row.address,
    ]);

    const doc = new jsPDF();
    doc.text("Supplier Details", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("SupplierDetails.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Supplier Details</title></head><body>"
    );
    printWindow.document.write("<h1>Supplier Details</h1>");
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
            Add Supplier
          </Button>
          <Button
            onClick={handleButtonClick2}
            variant="contained"
            startIcon={<MenuIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Supplier Balance
          </Button>
        </Stack>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardContent>
            <div className="bg-light">
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <h3>Manage Supplier</h3>
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: "blue", marginBottom: "5px" }} />
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
                            Supplier ID
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Supplier Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Phone Number
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Address
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
                                {columns.map((column) => {
                                  console.log("colunm ", column);
                                  return (<>
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
                                        <div>
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
                                
                                  </>)
                                  
                                })}
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
                      <h3 className="text-primary">Update Supplier</h3>
                    </Grid>
                    <Grid item xs={6} md={2} lg={2} >
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
                          <TextField
                            multiline
                            fullWidth
                            value={supplierName}
                            label="Supplier Name"
                            onChange={(e) => setSupplierName(e.target.value)}
                            variant="outlined"
                          />
                          <TextField
                            fullWidth
                            value={phoneNumber}
                            label="Phone Number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            multiline
                            variant="outlined"
                          />
                          <TextField
                            label="Email"
                            value={email}
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)}
                            multiline
                            variant="outlined"
                          />
                          <TextField
                            label="Address"
                            value={address}
                            fullWidth
                            onChange={(e) => setAddress(e.target.value)}
                            multiline
                            variant="outlined"
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
                          autoComplete="off"
                        >
                          <TextField
                            label="Note"
                            fullWidth
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            multiline
                            variant="outlined"
                          />
                          <Grid item>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Status
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                label="Status"
                                id="demo-simple-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                multiline
                                variant="outlined"
                              >
                                <MenuItem value={"Active"}>Active</MenuItem>
                                <MenuItem value={"Inactive"}>Inactive</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <div
                            style={{
                              marginTop: "10px",
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "7px",
                              border: "1px solid #ccc",
                              width: "100%",
                              padding: "12px",
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
                            {selectedImage && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "end",
                                }}
                              >
                                <img
                                  src={URL.createObjectURL(selectedImage)}
                                  value={selectedImage}
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

export default ManageSupplier;
