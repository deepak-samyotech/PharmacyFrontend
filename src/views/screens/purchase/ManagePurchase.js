import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
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
import { Box, Button, Typography, Modal } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import CopyToClipboard from "react-copy-to-clipboard";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
// import ManageBill from "./BillPdf/ManageBill";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Logo from "ui-component/Logo";
import "./style.css";
import logoing from "../../../assets/images/logo.svg";
import Loading from "ui-component/Loading";
import { fetchPurchaseBillingData } from "utils/api";


const tableContainer = {
  border: "1px solid #e0e0e0",
  borderRadius: "0px",
  //   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Adding box shadow
};
const tablediv = {
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow
};
const tableHead = {
  backgroundColor: "#f5f5f5",
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "800px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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

function ManagePurchase() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);


  //models
  const [open, setOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleOpen = (rowData) => {
    setSelectedRowData(rowData);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const columns = [
    { id: "id", label: "ID", align: "start", minWidth: 70 },
    {
      id: "supplierName",
      label: "Supplier Name",
      align: "center",
      minWidth: 170,
    },
    {
      id: "invoiceNumber",
      label: "Invoice Number",
      align: "center",
      minWidth: 170,
    },
    {
      id: "purchaseDate",
      label: "Purchase Date",
      align: "center",
      minWidth: 170,
    },
    { id: "details", label: "Details", align: "center", minWidth: 70 },
    { id: "totalAmount", label: "Total Amount", align: "center", minWidth: 70 },
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchPurchaseBillingData();

        // console.log("aggregate data is comingggg : - ", response);

        const transformedData = response.data?.data?.map((item) => ({
          id: item.id,
          p_id: item.p_id,
          sid: item.sid,
          entry_date: item.entry_date,
          invoiceNumber: item.invoice_no,
          purchaseDate: item.pur_date,
          details: item.pur_details,
          totalAmount: item.gtotal_amount,

          supplierName: item.supplier_name,
          supplier_email: item.supplier_email,
          supplier_address: item.supplier_address,
          supplier_phone: item.supplier_phone,

          payment_receiver_name: item.payment_receiver_name,
          payment_receiver_contact: item.payment_receiver_contact,
          payment_paid_amount: item.payment_paid_amount,
          payment_date: item.payment_date,
        }));
        setData(transformedData);
        setLoading(false);
        // const ids = transformedData.map((item) => item.id);
        // setId(ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const rows = data || [];
  

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
    link.setAttribute("download", "purchaseBilling.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export data to Excel
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Billing");
    XLSX.writeFile(workbook, "purchaseBilling.xlsx");

    // Create Excel file
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const excelUrl = URL.createObjectURL(excelFile);
  };

  // Function to export data to PDF
  const handleExportPDF = () => {
    const columns = [
      "Supplier Name",
      "Invoice Number",
      "Purchase Date",
      "Details",
      "Total Amount",
    ];
    const rows = sortedRows.map((row) => [
      row.supplierName,
      row.invoiceNumber,
      row.purchaseDate,
      row.details,
      row.totalAmount,
    ]);

    const doc = new jsPDF();
    doc.text("Purchase Billing", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("purchaseBilling.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Purchase Billing</title></head><body>"
    );
    printWindow.document.write("<h1>Purchase Billing</h1>");
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

  const handlePrintModal = () => {
    // Reference to the print section
    const printSection = document.getElementById("printSection");
    const printContent = document.getElementById("printContent");
    const logoImage = document.getElementById("logoImage");

    // Set the logo image source
    logoImage.src = "path/to/your/logo.png";

    // Clear previous content
    printContent.innerHTML = "";

    // Add the modal content
    if (selectedRowData) {
      printContent.innerHTML += `
        <div class='bg-light'>
          <div style='display: flex; justify-content: center;' spacing='2'>
            <div style='width: 100%; text-align: center;'>
              <img src="${logoImage.src}" alt='Logo' style='max-width: 100px; max-height: 100px;' />
            </div>
          </div>
          <hr />
          <div style='margin-bottom: 20px;'>
            <div style='display: flex; justify-content: space-between;'>
              <div>INVOICE</div>
              <div>${selectedRowData.invoiceNumber}</div>
            </div>
          </div>
          <div style='margin-bottom: 20px;'>
            <div style='display: flex; justify-content: space-between;'>
              <div>
                <h2>DJ Technology</h2>
                <p>1st Floor, Pramukh Plaza, Vijay Nagar, Indore</p>
              </div>
              <div style='text-align: right;'>
                <h5>TO,</h5>
                <h4 style='text-align: right;'>${selectedRowData.supplierName}</h4>
                <p style='text-align: right;'>${selectedRowData.supplier_address}</p>
                <p style='text-align: right;'>${selectedRowData.supplier_email}</p>
                <p style='text-align: right;'>${selectedRowData.supplier_phone}</p>
              </div>
            </div>
          </div>
          <div style='margin-top: 30px;'>
            <table border="1" style="width: 100%;">
              <thead>
                <tr>
                  <th>Receiver Name</th>
                  <th>Receiver Contact</th>
                  <th>Paid Amount</th>
                  <th>Payment Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${selectedRowData.payment_receiver_name}</td>
                  <td>${selectedRowData.payment_receiver_contact}</td>
                  <td>${selectedRowData.payment_paid_amount}</td>
                  <td>${selectedRowData.payment_date}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style='margin-top: 30px;'>
            <p>Signature</p>
            <hr />
          </div>
        </div>
      `;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printSection.innerHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };


  // navigation
  const navigate = useNavigate();
  // const handleButtonClick1 = () => {
  //     navigate('/medicine/add-medicine');
  // };
  const handleButtonClick2 = () => {
    navigate("/purchase/add-purchase");
  };

  const filteredRows = rows.filter((row) =>
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

  return (
    <>
      {/* <ManageBill open={open} handleClose={handleClose} /> */}
      <div style={{ margin: "10px" }}>
        <Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
          <Button
            onClick={handleButtonClick2}
            variant="contained"
            startIcon={<AddIcon />}
            style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
          >
            Add Purchase
          </Button>
        </Stack>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardContent>
            <div className="bg-light">
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <h3>Manage Purchase</h3>
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
                            Supplier Name
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Invoice Number
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Purchase Date
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Details
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            Total Amount
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
                                        row[column.id] || '-------'
                                      )}
                                      {column.id === "actions" ? (
                                        <div>
                                          <IconButton
                                            onClick={() => handleOpen(row)}
                                          >
                                            <ReceiptIcon />
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description">
            {selectedRowData && (
              <Card sx={tablediv} style={{ backgroundColor: "#ffffff" }}>
                <CardContent>
                  <div className="bg-light">
                    <Grid
                      style={{ display: "flex", justifyContent: "center" }}
                      spacing={2}
                    >
                      <Grid item xs={6} md={10} lg={10}>
                        <Logo />
                      </Grid>
                    </Grid>
                    <hr />
                    <div style={{ marginBottom: "20px" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={6}>
                          INVOICE
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          md={6}
                          style={{ display: "flex", justifyContent: "end" }}
                        >
                          {selectedRowData.invoiceNumber}
                        </Grid>
                      </Grid>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={6}>
                          <Typography variant="h2">DJ Technology</Typography>
                          <Typography variant="h6">
                            1st Floor, Pramukh Plaza, Vijay Nagar, Indore
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Grid
                            item
                            xs={6}
                            md={6}
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <Typography variant="h5">TO,</Typography>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            md={6}
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <h6>{selectedRowData.supplierName}</h6>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            md={6}
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <p>{selectedRowData.supplier_address}</p>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            md={6}
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <p>{selectedRowData.supplier_email}</p>
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            md={6}
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <p>{selectedRowData.supplier_phone}</p>
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            md={6}
                            style={{ display: "flex", justifyContent: "end" }}
                          ></Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        justifyContent="center"
                        style={{ marginTop: "30px" }}
                      >
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                          <TableContainer component={Paper} sx={tableContainer}>
                            <Table>
                              <TableHead sx={tableHead}>
                                <TableRow>
                                  <TableCell>Receiver Name</TableCell>
                                  <TableCell>Receiver Contact</TableCell>
                                  <TableCell>Paid Amount</TableCell>
                                  <TableCell>Payment Date</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    {selectedRowData.payment_receiver_name}
                                  </TableCell>
                                  <TableCell>
                                    {selectedRowData.payment_receiver_contact}
                                  </TableCell>
                                  <TableCell>
                                    {selectedRowData.payment_paid_amount}
                                  </TableCell>
                                  <TableCell>
                                    {selectedRowData.payment_date}
                                  </TableCell>
                                </TableRow>
                                {/* Add more rows as needed */}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                      <Grid style={{ marginTop: "30px" }}>
                        <p>Signature</p>
                        <hr />
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
                          onClick={handlePrintModal}
                          variant="contained"
                          startIcon={<PrintIcon />}
                        >
                          Print
                        </Button>
                        <Button onClick={handleClose} variant="outlined">
                          Cancel
                        </Button>
                      </Stack>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default ManagePurchase;
