import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import { tableCellClasses } from "@mui/material/TableCell";
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
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import CopyToClipboard from "react-copy-to-clipboard";
import CSVDownload from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Input from "@mui/material/Input";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import "jspdf-autotable";
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
function RegularCustomer() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //models
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const columns = [
    // { id: 'id', label: 'ID', align: 'center', minWidth: 70 },
    { id: "customerID", label: "Customer ID", align: "center", minWidth: 170 },
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
    { id: "type", label: "Type", align: "center", minWidth: 170 },
    { id: "target", label: "Target", align: "center", minWidth: 170 },
    { id: "discount", label: "Discount", align: "center", minWidth: 170 },
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/customer/");
        const transformedData = response.data?.data?.map((item) => ({
          // id: item._id,
          customerID: item.c_id,
          customerName: item.c_name,
          phoneNumber: item.cus_contact,
          type: item.c_type,
          target: item.target_amount,
          discount: item.regular_discount,
        }));

        // Filter only regular customers
        const regularCustomers = transformedData.filter(
          (customer) => customer.type === "Regular"
        );

        setData(regularCustomers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const rows = data;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    displayImage(file);
  };

  const [copied, setCopied] = useState(false);
  // navigation
  const navigate = useNavigate();
  const handleButtonClick1 = () => {
    navigate("/customer/add-customer");
  };
  const handleButtonClick2 = () => {
    navigate("/customer/manage-customer");
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
  const [selectedImage, setSelectedImage] = useState(null);

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
    link.setAttribute("download", "RegularCustomerDetails.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Regular Customer Details");
    XLSX.writeFile(workbook, "RegularCustomerDetails.xlsx");
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
    doc.text("Regular Customer Details", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("RegularCustomerDetails.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Regular Customer Details</title></head><body>"
    );
    printWindow.document.write("<h1>Regular Customer Details</h1>");
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
            Manage Customer
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
                  <h3>Regular Customer</h3>
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
                          {/* <StyledTableCell align='center'>ID</StyledTableCell> */}
                          <StyledTableCell align="center">
                            Customer ID
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Customer Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Phone Number
                          </StyledTableCell>
                          <StyledTableCell align="center">type</StyledTableCell>
                          <StyledTableCell align="center">
                            Target
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Discount
                          </StyledTableCell>
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
                              return (
                                <StyledTableRow key={row.id}>
                                  {columns.map((column) => (
                                    <StyledTableCell
                                      key={column.id}
                                      align={column.align}
                                    >
                                      {row[column.id]}
                                      {column.id === "actions" ? (
                                        <div
                                        // style={{
                                        //   display: "flex",
                                        //   justifyContent: "center",
                                        //   width: "100px",
                                        //   alignItems: "center",
                                        // }}
                                        >
                                          {/* <IconButton onClick={handleOpen}>
                                          <EditIcon />
                                        </IconButton> */}
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
      </div>
      {/* <Modal
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
                          <TextField
                            size="small"
                            id="outlined-textarea"
                            label="Customer ID"
                            placeholder="Customer ID"
                            multiline
                          />
                          <TextField
                            size="small"
                            id="outlined-textarea"
                            label="Customer Name"
                            placeholder="Customer Name"
                            multiline
                          />
                          <TextField
                            size="small"
                            id="outlined-textarea"
                            label="Phone Number"
                            placeholder="Phone Number"
                            multiline
                          />
                        </Box>
                      </Grid>
                    
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
                            size="small"
                            id="outlined-textarea"
                            label="Type"
                            placeholder="Type"
                            multiline
                          />
                          <TextField
                            size="small"
                            id="outlined-textarea"
                            label="Target"
                            placeholder="Target"
                            multiline
                          />
                          <TextField
                            size="small"
                            id="outlined-textarea"
                            label="Discount"
                            placeholder="Barcode Number"
                            multiline
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
                      <Button variant="contained">Submit</Button>
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
      </Modal> */}
    </>
  );
}

export default RegularCustomer;
