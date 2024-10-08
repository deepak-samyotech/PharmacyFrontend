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
import * as XLSX from "xlsx";
import TablePagination from "@mui/material/TablePagination";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import Loading from "ui-component/Loading";
import { fetchAmbulance, handleRetry, postAmbulanceData } from "utils/api";
import InternalServerError from "ui-component/InternalServerError";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  margin: "30px",
  padding: "30px",
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

function Ambulance() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);

  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [hospital_name, setHospital_name] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({});


  const columns = [
    { id: "name", label: "Name", align: "center", minWidth: 170 },
    { id: "email", label: "Email", align: "center", minWidth: 170 },
    { id: "contact", label: "Contact", align: "center", minWidth: 170 },
    { id: "address", label: "Address", align: "center", minWidth: 170 },
    {
      id: "hospital_name",
      label: "Hospital Name",
      align: "center",
      minWidth: 170,
    },
    { id: "notes", label: "Notes", align: "center", minWidth: 170 },
  ];
  //GET API call

  const fetchData = async () => {
    try {
      const response = await fetchAmbulance();
      const transformedData = response?.data?.data?.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        contact: item.contact,
        address: item.address,
        hospital_name: item.hospital_name,
        notes: item.notes,
      }));
      setData(transformedData);
      const ids = transformedData.map((item) => item.id);
      setData(transformedData);
      setLoading(false);
      // setId(ids);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);
  const rows = data;

  // POST API call
  //phone number
  const handlephoneNum = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, "");
    setContact(numericInput);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (validateForm()) {
        const formData = new FormData();
        formData.append("name", Name);
        formData.append("email", email);
        formData.append("contact", contact);
        formData.append("address", address);
        formData.append("hospital_name", hospital_name);
        formData.append("notes", notes);


        const response = await postAmbulanceData(formData)
        if (response.status === 200) {
          // setSuccessAlert(true);
          fetchData();
          setOpen(false);
          toast.success("Data added Successfully.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError(true);
    }
  };

  const validateForm = () => {

    console.log("Here--------");

    const errors = {};
    if (Name.trim() === '') {
      errors.Name = 'Name is required';
    }
    if (contact.trim() === '') {
      errors.contact = 'Contact is required';
    }
    if (email.trim() === '') {
      errors.email = 'Email is required';
    }
    if (address.trim() === '') {
      errors.address = 'Address is required';
    }
    if (hospital_name.trim() === '') {
      errors.hospital_name = 'Hospital name is required';
    }
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //models-->
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    hospital_name: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    // Reset form fields
    setFormData({
      name: "",
      contact: "",
      email: "",
      address: "",
      hospital_name: "",
      notes: "",
    });
  };



  const handleCopy = () => {
    const tableData = sortedRows
      .map((row) => Object.values(row).join(","))
      .join("\n");
    navigator.clipboard
      .writeText(tableData)
      .then(() => setCopied(true))
      .catch((error) => console.error("Error copying table data:", error));
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
    link.setAttribute("download", "Ambulance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ambulance");
    XLSX.writeFile(workbook, "Ambulance.xlsx");
  };

  const handleExportPDF = () => {
    const columns = ["Name", "Contact", "Email", "Address", "Hospital Name", "Notes"];
    const rows = sortedRows.map((row) => [
      row.name,
      row.contact,
      row.email,
      row.address,
      row.hospital_name,
      row.notes,
    ]);

    const doc = new jsPDF();
    doc.text("Ambulance", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("Ambulance.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Ambulance</title></head><body>"
    );
    printWindow.document.write("<h1>Ambulance</h1>");
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

  const filteredRows = (data || []).filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
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

  if (error) {
    return <InternalServerError onRetry={handleRetry} />; // Show error page if error occurred
  }


  return (
    <div style={{ margin: "10px" }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        style={{ margin: "10px" }}
      >
        Add Ambulance
      </Button>
      <Card style={{ backgroundColor: "#ffffff" }}>
        <CardContent>
          <div className="bg-light">
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>Manage Ambulance</h3>{" "}
                {/* // -----------------------------name----------------- */}
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
                        <StyledTableCell align="center">Name</StyledTableCell>
                        <StyledTableCell align="center">Email</StyledTableCell>
                        <StyledTableCell align="center">
                          Contact
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Address
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Hospital Name
                        </StyledTableCell>
                        <StyledTableCell align="center">Notes</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ?
                        (
                          <StyledTableRow>
                            <StyledTableCell colSpan={columns.length} sx={{ p: 2 }}>
                              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                <Loading /> {/* Render loading spinner */}
                              </Box>
                            </StyledTableCell>
                          </StyledTableRow>
                        ) :
                        (sortedRows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={columns.length} align="center">
                              No Data Found
                            </TableCell>
                          </TableRow>
                        ) : 
                          sortedRows
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
                          })
                        )
                      }
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h2" component="h2">
            Add Ambulance
          </Typography>
          <Divider style={{ margin: "5px" }} />
          <Divider style={{ marginBottom: "20px" }} />
          <Typography id="modal-modal-description" variant="h6" component="h2">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="name"
                    label="Name"
                    placeholder="Name"
                    multiline
                    size="small"
                    required
                    fullWidth
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.Name}
                    helperText={errors.Name}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    label="Phone Number"
                    type="number"
                    value={contact}
                    size="small"
                    id="s_phone"
                    required
                    onChange={handlephoneNum}
                    fullWidth
                    error={!!errors.contact}
                    helperText={errors.contact}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="email"
                    label="Email"
                    placeholder="Email"
                    multiline
                    size="small"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="address"
                    label="Address"
                    placeholder="Address"
                    multiline
                    size="small"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="hospital_name"
                    label="hospital Name"
                    placeholder="hospital Name"
                    multiline
                    size="small"
                    value={hospital_name}
                    onChange={(e) => setHospital_name(e.target.value)}
                    required
                    fullWidth
                    error={!!errors.hospital_name}
                    helperText={errors.hospital_name}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    id="notes"
                    label="Notes"
                    placeholder="Notes"
                    multiline
                    size="small"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    style={{ margin: "10px" }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ margin: "10px" }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Ambulance;
