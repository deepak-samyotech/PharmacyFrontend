/*eslint-disable*/
import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Divider from "@mui/material/Divider";
import CopyToClipboard from "react-copy-to-clipboard";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import Input from "@mui/material/Input";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { Modal } from "@mui/material";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";

const styles = {
  smallTypography: {
    fontSize: "small",
    display: "flex",
    justifyContent: "end",
  },
  mainheadBIll: {
    fontSize: "small",
    display: "flex",
    justifyContent: "center",
  },
  invoiceidData: {
    fontSize: "small",
    display: "flex",
    justifyContent: "start",
  },
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#808080",
    color: theme.palette.common.white,
    textAlign: "Center",
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

function ManageInvoice() {
  const [searchTerm, setSearchTerm] = useState("");

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const columns = [
    { id: "id", label: "ID", align: "center", minWidth: 170 },
    {
      id: "invoiceNumber",
      label: "Invoice Number",
      align: "center",
      minWidth: 170,
    },
    {
      id: "customerName",
      label: "Customer Name",
      align: "center",
      minWidth: 170,
    },
    {
      id: "customerType",
      label: "Customer Type",
      align: "center",
      minWidth: 170,
    },
    { id: "createDate", label: "Create Date", align: "center", minWidth: 170 },
    {
      id: "totalAmount",
      label: "Total Amount",
      align: "center",
      minWidth: 170,
    },
    { id: "totalPaid", label: "Total Paid", align: "center", minWidth: 170 },
    { id: "totalDue", label: "Total Due", align: "center", minWidth: 170 },
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/manage_invoice"
        );

        const transformedData = response.data?.data?.map((item) => ({
          id: item.id,
          invoiceNumber: item.invoiceId,
          customerName: item.customerName,
          customerContact: item.contact,
          customerType: item.customerType,
          createDate: item.createDate,
          totalAmount: item.grand_total,
          totalPaid: item.total_paid,
          totalDue: item.total_due,
          medicineData: item.medicineData,
        }));
        setData(transformedData);
        const ids = transformedData.map((item) => item.id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const rows = data;

  const handleViewInvoice = (rows) => {
    setSelectedInvoice(rows);
    setOpenModal(true);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const sortedRows = stableSort(filteredRows, getComparator(order, orderBy));
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

  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    // Define CSV headers
    const headers = [
      { label: "invoice Number", key: "invoiceNumber" },
      { label: "Customer Name", key: "customerName" },
      { label: "customer Type", key: "customerType" },
      { label: "create Date", key: "createDate" },
      { label: "total Amount", key: "totalAmount" },
      { label: "total Paid", key: "totalPaid" },
      { label: "total Due", key: "totalDue" },
    ];

    // Create CSV data
    const csvData = [headers, ...data.map((item) => Object.values(item))];

    // Create CSV file
    const csvFile = new Blob([csvData.map((row) => row.join(",")).join("\n")], {
      type: "text/csv",
    });
    const csvUrl = URL.createObjectURL(csvFile);

    // Trigger download
    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", "manage_invoice_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    // Create Excel workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(data),
      "Regular Data"
    );

    // Create Excel file
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const excelUrl = URL.createObjectURL(excelFile);

    // Trigger download
    const link = document.createElement("a");
    link.href = excelUrl;
    link.setAttribute("download", "manage_invoice_data.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Regular Data", 10, 10);
    pdf.autoTable({
      head: [
        [
          "invoice Number",
          "Customer Name",
          "Phone Number",
          "create Date",
          "total Amount",
          "total Paid",
          "total Due",
        ],
      ],
      body: data.map((item) => Object.values(item)),
    });
    pdf.save("manage_invoice_data.pdf");
  };

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

  return (
    <>
      <div style={{ margin: "10px" }}>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardContent>
            <div className="bg-light">
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <h3>Manage Invoice</h3>
                </Grid>
              </Grid>
              <Divider sx={{ borderColor: "blue", marginBottom: "5px" }} />
              <Stack
                direction="row"
                spacing={2}
                style={{ marginBottom: "5px" }}
              >
                <CopyToClipboard
                  text="Your data to copy"
                  onCopy={() => setCopied(true)}
                >
                  <Button variant="outlined">Copy</Button>
                </CopyToClipboard>
                <Button variant="outlined" onClick={handleExportCSV}>
                  CSV
                </Button>
                <Button variant="outlined" onClick={handleExportExcel}>
                  Excel
                </Button>
                <Button variant="outlined" onClick={handleExportPDF}>
                  PDF
                </Button>
                <Button variant="outlined" onClick={handlePrint}>
                  Print
                </Button>
                <Input
                  placeholder="Search"
                  style={{ marginLeft: "auto", marginRight: "15px" }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Stack>
              <div>
                <Paper sx={{ width: "auto", marginTop: "10px" }}>
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: "auto" }}
                      aria-label="customized table"
                    >
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Invoice Number</StyledTableCell>
                          <StyledTableCell>Customer Name</StyledTableCell>
                          <StyledTableCell>Customer Type</StyledTableCell>
                          <StyledTableCell>Create Date</StyledTableCell>
                          <StyledTableCell>Total Amount</StyledTableCell>
                          <StyledTableCell>Total Paid</StyledTableCell>
                          <StyledTableCell>Total Due</StyledTableCell>
                          <StyledTableCell>View</StyledTableCell>
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
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          width: "100px",
                                          alignItems: "center",
                                        }}
                                      >
                                        <IconButton
                                          color="gray"
                                          aria-label="view"
                                          onClick={() => handleViewInvoice(row)} // Pass 'row' instead of 'rows'
                                        >
                                          <RemoveRedEyeIcon />
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            height: "auto",
            bgcolor: "background.paper",
            // border: "2px solid #000",
            boxShadow: 24,

            // clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 20px))"
          }}
        >
          {/* Render the invoice receipt inside the modal */}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: "10px",
              top: "10px",
              backgroundColor: "#ffffff",
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          <div className="p-3">
            {selectedInvoice && (
              <>
                <div>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={styles.mainheadBIll}
                  >
                    Name : {selectedInvoice.customerName}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={styles.mainheadBIll}
                  >
                    Contact: {selectedInvoice.customerContact}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      style={styles.smallTypography}
                    >
                      ID: {selectedInvoice.id}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      style={styles.smallTypography}
                    >
                      Date: {selectedInvoice.createDate}
                    </Typography>
                  </div>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={styles.invoiceidData}
                  >
                    Invoice No.: {selectedInvoice.invoiceNumber}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>SL</TableCell>
                          <TableCell>Item/Desc</TableCell>
                          <TableCell>Qty.</TableCell>
                          <TableCell>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedInvoice && selectedInvoice.medicineData ? (
                          selectedInvoice.medicineData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.medicine}</TableCell>
                              <TableCell>{item.qty}</TableCell>
                              <TableCell>{item.product_total}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4}>
                              No medicine list available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ ...styles.smallTypography, fontWeight: "bold" }}
                  >
                    Total Amount : {selectedInvoice.totalAmount}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={styles.smallTypography}
                  >
                    Paid : {selectedInvoice.totalPaid}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    style={styles.smallTypography}
                  >
                    Due : {selectedInvoice.totalDue}
                  </Typography>

                  <Typography
                    variant="h6"
                    gutterBottom
                    // style={styles.smallTypography}
                  >
                    THANK YOU
                  </Typography>
                </div>
              </>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default ManageInvoice;
