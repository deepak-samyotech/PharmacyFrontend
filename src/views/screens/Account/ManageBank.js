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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import MenuIcon from "@mui/icons-material/Menu";
import Input from "@mui/material/Input";
import TablePagination from "@mui/material/TablePagination";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Swal from "sweetalert2";

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

function ManageBank() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);
  const [id, setId] = useState([]);
  const [bankDataList, setBankDataList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");

  const [bankname, setBankName] = useState("");
  const [accountName, SetAccountName] = useState("");
  const [accountNumber, SetAccountNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const columns = [
    // { id: "id", label: "ID", align: "start", minWidth: 70 },
    { id: "bankName", label: "bankName", align: "center", minWidth: 170 },
    { id: "accountName", label: "accountName", align: "center", minWidth: 170 },
    {
      id: "accountNumber",
      label: "accountNumber",
      align: "center",
      minWidth: 170,
    },
    { id: "bankAddress", label: "bankAddress", align: "center", minWidth: 70 },
    // { id: "imageUrl", label: "Image", align: "start", minWidth: 170 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/bank");
        // Check the structure of response.data
        const bankList = response.data;
        console.log("response of bank", response);
        console.log("bankList of bank", bankList);

        const transformedData = bankList.data.map((item) => ({
          // bank_id: item.bank_id,
          bankName: item.bank_name,
          accountName: item.account_name,
          accountNumber: item.account_number,
          bankAddress: item.branch,
          // imageUrl: item.image,
        }));
        // Update state only if transformedData is an array
        if (Array.isArray(transformedData)) {
          setBankDataList(transformedData);
        } else {
          console.error("Data is not in the expected format:", transformedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const rows = bankDataList;
  console.log("rows of bank", rows);

  const [copied, setCopied] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bank_name", bankname);
    formData.append("account_name", accountName);
    formData.append("account_number", accountNumber);
    formData.append("branch", branch);
    formData.append("image", selectedImage);

    axios
      .post(`http://localhost:8080/bank`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage("Bank data added successfully.");
          setFailureMessage("");
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Bank data added successfully.",
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      })
      .catch((error) => {
        setFailureMessage("Error adding Bank data. Please try again.");
        console.error("Error adding Bank data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error adding Bank data. Please try again.",
        });
      });
  };

  //models
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Manage Bank</title></head><body>"
    );
    printWindow.document.write("<h1>Manage Bank</h1>");
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
    link.setAttribute("download", "manage_bank_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Manage Bank Data");
    XLSX.writeFile(workbook, "manage_bank_data.xlsx");
  };

  // Function to export data to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Bank Name", dataKey: "bankName" },
      { header: "Account Name", dataKey: "accountName" },
      { header: "Account Number", dataKey: "accountNumber" },
      { header: "Bank Address", dataKey: "bankAddress" },
    ];
    const rows = sortedRows.map((row) => ({
      bankName: row.bankName,
      accountName: row.accountName,
      accountNumber: row.accountNumber,
      bankAddress: row.bankAddress,
    }));

    doc.text("Manage Bank Data", 10, 10);
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 20,
      theme: "grid",
      headStyles: {
        fillColor: [33, 150, 243],
      },
    });
    doc.save("manage_bank_data.pdf");
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
      <div style={{ margin: "10px" }}>
        <Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
          <Button
            onClick={() => handleOpen()}
            variant="contained"
            startIcon={<AddIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Add Bank
          </Button>
        </Stack>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardContent>
            <div className="bg-light">
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <h3>Manage Bank</h3>
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
                            Bank Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Account Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Account Number
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Bank Address
                          </StyledTableCell>
                          {/* <StyledTableCell align="center">
                              Image
                            </StyledTableCell> */}
                          {/* <StyledTableCell align="center">
                              Actions
                            </StyledTableCell> */}
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
                                    {/* {column.id === "actions" ? (
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
                                      )} */}
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
      {/* // ==========>Model<========= */}
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
                      <h3 className="text-primary">Add Bank</h3>
                    </Grid>
                  </Grid>
                  <hr />
                  <div style={{ marginBottom: "20px" }}>
                    <Grid container spacing={2}>
                      {/* First Column */}
                      <Grid item xs={12} md={12}>
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
                            label="Bank Name"
                            placeholder="Bank Name"
                            onChange={(e)=>setBankName(e.target.value)}
                            multiline
                          />
                          <TextField
                            size="small"
                            label="Account Name"
                            placeholder="Account Name"
                            type="text"
                            onChange={(e)=>SetAccountName(e.target.value)}
                            fullWidth
                          />
                          <TextField
                            size="small"
                            label="Account Number"
                            placeholder="Account Number"
                            type="text"
                            onChange={(e)=>SetAccountNumber(e.target.value)}
                            fullWidth
                          />
                          <TextField
                            size="small"
                            label="Branch"
                            placeholder="Branch"
                            type="text"
                            onChange={(e)=>setBranch(e.target.value)}
                            fullWidth
                          />
                          <div
                            style={{
                              marginTop: "7px",
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
                    </Grid>
                  </div>
                  {/* <hr /> */}
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
                      <Button onClick={handleSubmit} variant="contained">
                        Submit
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

export default ManageBank;
