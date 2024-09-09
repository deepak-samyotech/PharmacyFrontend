/*eslint-disable*/
import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { updateEmployeeData } from "utils/api";
import { toast } from "react-toastify";
import Loading from "ui-component/Loading";


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

function ManageEmployee() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);
  const [loading, setLoading] = useState(true);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //employee status
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  //   employee role
  const handleroleChange = (event) => {
    setRole(event.target.value);
  };

  const columns = [
    { id: "employeeId", label: "Employee ID", align: "center", minWidth: 170 },
    { id: "name", label: "Name", align: "center", minWidth: 170 },
    {
      id: "phoneNumber",
      label: "Phone Number",
      align: "center",
      minWidth: 170,
    },
    { id: "email", label: "Email", align: "center", minWidth: 170 },
    { id: "role", label: "role", align: "center", minWidth: 170 },
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];


  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/employee-register");
      console.log("response2332 : -------", response);

      const transformedData = response.data?.data?.map((item) => ({
        id: item.id,
        employeeId: item.em_id,
        // name: item.firstName + " " + item.lastName,
        name: item.name,
        phoneNumber: item.contact,
        email: item.email,
        role: item.role,
      }));

      console.log("Transformed data : ", transformedData);
      setData(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {

    fetchData();

  }, []);
  console.log(data, "data");

  // update employee
  const [successAlert, setSuccessAlert] = useState(false);
  const [empId, setEmpId] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setfirstName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [entrydate, setEntrydate] = useState("");
  const [role, setRole] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  //models
  const [open, setOpen] = React.useState(false);
  const handleOpen = async (row) => {

    console.log("Row : ", row);
    setEditedRowData(row);

    console.log("edited data", editedRowData);
    setOpen(true);

    setEmpId(row.employeeId)
    setName(row.name);
    setEmail(row.email);
    setContact(row.phoneNumber);
    setRole(row.role);
  };
  const handleClose = () => setOpen(false);
  //PUT Api calling

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // formData.append("firstName", name.split(" ")[0]);
    // formData.append("lastName", name.split(" ")[1]);
    formData.append("name", name)
    formData.append("email", email);
    formData.append("password", password);
    formData.append("contact", contact);
    formData.append("address", address);
    // formData.append("details", details);
    // formData.append("entrydate", entrydate);
    formData.append("role", role);
    formData.append("status", status);
    formData.append("image", selectedImage);

    console.log("firstName : ", name.split(" ")[0]);
    console.log("lastName : ", name.split(" ")[1]);
    console.log("email : ", email);
    console.log("password : ", password);
    console.log("contact : ", contact);
    console.log("address : ", address);
    // console.log("details : ", details);
    // console.log("entrydate : ", entrydate);
    console.log("role : ", role);
    console.log("status : ", status);
    console.log("image : ", selectedImage);
    console.log("empid : ", editedRowData.id);


    console.log("formadata : ", formData);


    const response = await updateEmployeeData(formData, editedRowData.id);

    console.log("response", response);
    if (response) {
      setOpen(false);
      fetchData();
      toast.success("Data Updated Successfully");
      setSuccessAlert(true);
    }
  };
  const rows = data;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // navigation
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/Employee/add-Employee");
  };

  const [copied, setCopied] = useState(false);

  const linkStyles = {
    color: "#00BFFF", // Thic color code
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
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
    link.setAttribute("download", "EmployeeManagement.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Management");
    XLSX.writeFile(workbook, "EmployeeManagement.xlsx");
  };



  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Management", 10, 10);

    const columns = [
      { header: "Employee Id", dataKey: "employeeId" },
      { header: "Name", dataKey: "name" },
      { header: "Phone Number", dataKey: "phoneNumber" },
      { header: "Email", dataKey: "email" },
      { header: "Role", dataKey: "role" },
    ];

    const rows = sortedRows.map((row) => ({
      employeeId: row.employeeId,
      name: row.name,
      phoneNumber: row.phoneNumber,
      email: row.email,
      role: row.role,
    }));

    doc.autoTable({
      head: [columns.map((col) => col.header)],
      body: rows.map((row) => Object.values(row)),
      startY: 20,
    });

    doc.save("EmployeeManagement.pdf");
  };


  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Employee Management</title></head><body>"
    );
    printWindow.document.write("<h1>Employee Management</h1>");
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

  // console.log("sortedRows : ", sortedRows);

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
            Add Employee
          </Button>
        </Stack>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardContent>
            <div className="bg-light">
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <h3> Manage Employee</h3>
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

              <Paper sx={{ width: "auto", marginTop: "10px" }}>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: "auto" }}
                    aria-label="customized table"
                  >
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">
                          Employee ID
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Employee Name
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Phone Number
                        </StyledTableCell>
                        <StyledTableCell align="center">Email</StyledTableCell>
                        <StyledTableCell align="center">Role</StyledTableCell>
                        <StyledTableCell align="center">
                          Actions
                        </StyledTableCell>
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
                        (sortedRows
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, index) => {
                            // console.log("row : ",row);
                            return (
                              <StyledTableRow key={row.id}>
                                {columns.map((column) => {
                                  // console.log("colunm ", column);
                                  return (

                                    <>
                                      <StyledTableCell
                                        key={column.id}
                                        align={column.align}
                                      >
                                        {row[column.id]}
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
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </StyledTableCell>
                                    </>
                                  )
                                })}
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
                    <Grid xs={6} md={10} lg={10}>
                      <h3>Update Employee</h3>
                    </Grid>
                    <Grid xs={6} md={2} lg={2}>
                      Wednesday 7th of February 2024 04:37:08 PM
                    </Grid>
                  </Grid>
                  <hr />
                  <div>
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
                            id="name"
                            label="Employee Name"
                            placeholder="Employee Name"
                            multiline
                            size="small"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <TextField
                            id="outlined-textarea"
                            label="Email"
                            placeholder="Email"
                            multiline
                            size="small"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <TextField
                            id="outlined-textarea"
                            label="Password"
                            placeholder="Password"
                            multiline
                            size="small"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          {/* <TextField
                            id="outlined-textarea"
                            label="Confirm Password"
                            placeholder="Confirm Password"
                            multiline
                            size="small"
                            required
                          /> */}

                          <div
                            style={{
                              marginTop: "8px",
                              marginBottom: "8px",
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "10px",
                              border: "1px solid #ccc",
                              width: "100%",
                              padding: "9px",
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
                            id="outlined-textarea"
                            label="Phone Number"
                            placeholder="Phone Number"
                            multiline
                            size="small"
                            required
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                          />
                          <TextField
                            id="outlined-textarea"
                            label="Address"
                            placeholder="Address"
                            multiline
                            size="small"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                          <Grid item>
                            <FormControl size="small" fullWidth>
                              <InputLabel id="status">
                                Employee Status
                              </InputLabel>
                              <Select
                                labelId="status"
                                id="status"
                                value={status}
                                label="Employee Status"
                                onChange={handleStatusChange}
                              >
                                <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                                <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item>
                            <FormControl size="small" fullWidth>
                              <InputLabel id="status">Employee role</InputLabel>
                              <Select
                                labelId="role"
                                id="role"
                                value={role}
                                label="Employee role"
                                onChange={handleroleChange}
                              >
                                <MenuItem value={"SALESMAN"}>SALESMAN</MenuItem>
                                <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                                <MenuItem value={"MANAGER"}>MANAGER</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          {/* <TextField
                            id="details"
                            label="Note"
                            placeholder="Note"
                            multiline
                            onChange={(e) => setDetails(e.target.value)}
                            rows={4}
                          /> */}
                        </Box>
                      </Grid>
                    </Grid>
                  </div>
                  <hr />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Stack spacing={2} direction="row">
                      <Button onClick={handleSubmit} variant="contained">
                        Submit
                      </Button>
                      <Button variant="outlined"
                        onClick={handleClose}
                      >Cancel
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

export default ManageEmployee;
