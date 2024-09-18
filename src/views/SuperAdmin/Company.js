// import React from 'react'

// const Company = () => {
//   return (
//     <div>Companies</div>
//   )
// }

// export default Company;

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
  Switch,
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
// import "./manageMedicine.css";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import Loading from "ui-component/Loading";

import { ToastContainer, toast } from 'react-toastify';
import { fetchAdmins, fetchMedicine, fetchSupplierData, handleRegister, handleRetry, putMedicineData, toggleAdminStatus } from "utils/api";
import InternalServerError from "ui-component/InternalServerError";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "auto",
//   bgcolor: "background.paper",
//   boxShadow: 24,
// };
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  // p: 4,
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

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#2ECA45',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

function Company() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const columns = [
    // { id: 'id', label: 'ID', align: 'start', minWidth: 70 },
    { id: "companyName", label: "Company Name", align: "center", minWidth: 170 },
    { id: "description", label: "Description", align: "center", minWidth: 170 },
    { id: "phoneNumber", label: "Phone Number", align: "center", minWidth: 170 },
    { id: "email", label: "Email", align: "center", minWidth: 170 },
    { id: "active", label: "Active", align: "center", minWidth: 170 },
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);

  const [company, setCompany] = useState({
    companyName: '',
    description: '',
    email: '',
    phoneNumber: '',
    password: '',
  })

  const fetchAdminData = async () => {
    try {
      // Fetch medicine data
      const responseAdmins = await fetchAdmins();
      const transformedDataAdmin = responseAdmins?.data?.users?.map(
        (item) => ({
          id: item._id,
          companyName: item.companyName,
          description: item.description,
          email: item.email,
          phoneNumber: item.phoneNumber,
          active: item.active,
        })
      );

      setData(transformedDataAdmin);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);
  const rows = data || [];

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const response = await handleRegister(company);

      if (response?.status === 201) {
        fetchAdminData();
        setOpen(false);
        toast.success('User Created Successfully');
      }
    } catch (error) {
      console.error(`Error : `, error);
      setError(true);
    }
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

  const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedRows.length - page * rowsPerPage);

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
    link.setAttribute("download", "company.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Company Details");
    XLSX.writeFile(workbook, "company.xlsx");

    // Create Excel file
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const excelUrl = URL.createObjectURL(excelFile);
  };


  // Function to export data to PDF
  const handleExportPDF = () => {
    const columns = [
      "Company Name",
      "Description",
      "Email",
      "Phone Number",
      "Active",
    ];
    const rows = sortedRows.map((row) => [
      row.companyName,
      row.description,
      row.email,
      row.phoneNumber,
      row.active,
    ]);

    const doc = new jsPDF();
    doc.text("Company Details", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("companyDetails.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Company Details</title></head><body>"
    );
    printWindow.document.write("<h1>Company Details</h1>");
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

  const handleStatusChange = async(row) => {
    try {
      const response = await toggleAdminStatus(row?.id);
      fetchAdminData();
    } catch (error) {
      console.error(`Error : `, error);
      setError(true);
    }
  }

  if (error) {
    return <InternalServerError onRetry={handleRetry} />;
  }

  return (
    <>
      <div>
        <Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
            onClick={() => handleOpen()}
          >
            Add Company
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
                  <h3> Manage Company</h3>
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
                              Company Name
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Description
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Phone Number
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Email Address
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Status
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Action
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
                            (sortedRows.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                  No Data Found
                                </TableCell>
                              </TableRow>
                            ) :
                              sortedRows.slice(
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
                                          {column.id === 'active' ? (
                                            row[column.id] ? (
                                              <div style={{ backgroundColor: "green", borderRadius: "5px", color: "white" }}>
                                                Active
                                              </div>
                                            ) : (
                                              <div style={{ backgroundColor: "red", borderRadius: "5px", color: "white" }}>
                                                Inactive
                                              </div>
                                            )
                                          ) : column.id === 'actions' ? (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                // width: "100px",
                                                alignItems: "center",
                                              }}
                                            >
                                              <IOSSwitch
                                                sx={{ m: 1 }}
                                                checked={row['active']}
                                                onChange={(event) => handleStatusChange(row)}
                                              />
                                            </div>
                                          ) : (
                                            row[column.id]
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
                    <Grid item >
                      <h3 className="text-primary">Add New Company</h3>
                    </Grid>
                  </Grid>
                  <hr />
                  <div style={{ marginBottom: "10px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={8} lg={11}>
                        <Box
                          component="form"
                          sx={{
                            "& .MuiTextField-root": { m: 1, width: "100%" },
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            size="small"
                            id="company_name"
                            required
                            value={company.companyName}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                companyName: e.target.value, // Update only the companyName field
                              })
                            }
                            label="Company Name"
                            placeholder="Company Name"
                          />
                          <TextField
                            size="small"
                            id="description"
                            required
                            label="Description"
                            placeholder="Description"
                            value={company.description}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                description: e.target.value, // Update only the companyName field
                              })
                            }
                            multiline
                          />
                          <TextField
                            size="small"
                            label="Email Address"
                            id="email"
                            type="email"
                            placeholder="Email Address"
                            multiline
                            required
                            value={company.email}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                email: e.target.value, // Update only the companyName field
                              })
                            }
                            fullWidth
                          />
                          <TextField
                            size="small"
                            label="Phone Number"
                            id="phone_number"
                            placeholder="Phone Number"
                            type="tel"
                            multiline
                            required
                            value={company.phoneNumber}
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                phoneNumber: e.target.value, // Update only the companyName field
                              })
                            }
                            fullWidth
                          />
                          <TextField
                            size="small"
                            id="password"
                            label="Password"
                            value={company.password}
                            type="text"
                            onChange={(e) =>
                              setCompany({
                                ...company,
                                password: e.target.value, // Update only the companyName field
                              })
                            }
                          // InputLabelProps={{ shrink: true }}
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
                        onClick={handleSubmit}
                      >
                        Add
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

export default Company;
