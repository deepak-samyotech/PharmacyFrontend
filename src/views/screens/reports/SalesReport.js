import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
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
import axios from "axios";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CopyToClipboard from "react-copy-to-clipboard";
import * as XLSX from "xlsx";
import "jspdf-autotable";
import jsPDF from "jspdf";
import Input from "@mui/material/Input";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import { Form, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Loading from "ui-component/Loading";
import InternalServerError from "ui-component/InternalServerError";
import { handleRetry } from "utils/api";


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

function SalesReport() {
  const [selectedOption, setSelectedOption] = useState("sale_report");
  const [apiData, setApiData] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  const columns = [
    { id: "id", label: "ID", align: "center", minWidth: 170 },
    { id: "createDate", label: "Create Date", align: "center", minWidth: 170 },
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
      id: "totalAmount",
      label: "Total Amount",
      align: "center",
      minWidth: 170,
    },
  ];


  const fetchSaleData = async () => {
    try {
      const response = await fetchSaleData();
      const transformedData = response.data?.data?.map((item) => ({
        id: item.id,
        createDate: item.createDate,
        invoiceNumber: item.invoiceNumber,
        customerName: item.supplierName,
        totalAmount: item.totalAmount,
      }));
      setApiData(transformedData);
      setLoading(false);
      const ids = transformedData.map((item) => item.id);
      setData(transformedData);
      // setId(ids);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
  };

  useEffect(() => {


    fetchSaleData();
  }, []);

  const rows = data;


  const handleStartDateChange = (date) => {
    console.log("start date : ", date);
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    console.log("end date : ", date);
    setEndDate(date);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    console.log("data : ", data);

    // Adjust endDate to include the entire day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

    // Filter data based on selected date range
    const filteredData = apiData.filter((item) => {
      const itemDate = new Date(item.createDate);
      return startDate <= itemDate && itemDate <= adjustedEndDate;
    });
    // Set filtered data
    console.log(filteredData);
    setData(filteredData);
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };



  //--------------------range date----------------------------
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);


  const handleSubmit = () => {
    if (startDate && endDate) {
      if (new Date(endDate) < new Date(startDate)) {
        alert("End date cannot be less than start date.");
      } else {
        alert(`Selected Date Range: ${startDate} to ${endDate}`);
      }
    } else {
      alert("Please select both start and end dates.");
    }
  };




  const handleCopy = () => {
    const tableData = sortedRows.map((row) => Object.values(row).join(",")).join("\n");
    navigator.clipboard.writeText(tableData)
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
    link.setAttribute("download", "salesReport.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "salesReport.xlsx");
  };

  const handleExportPDF = () => {
    const columns = ["Sales Date", "Invoice Number", "Customer Name", "Total Amount"];
    const rows = sortedRows.map((row) => [
      row.createDate,
      row.invoiceNumber,
      row.customerName,
      row.totalAmount,
    ]);

    const doc = new jsPDF();
    doc.text("Sales Report", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("salesReport.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Sales Report</title></head><body>"
    );
    printWindow.document.write("<h1>Sales Report</h1>");
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
    <>
      <Grid container spacing={2}>
        <Grid xs={6} md={10} lg={10}>
          <h3>Sales Report</h3>
        </Grid>
      </Grid>
      {/* --------------------range date---------------------------- */}
      <Box style={{ justifyContent: "center" }}>
        <Form
          onSubmit={handleFormSubmit}

        >
          <Container>
            <Row>
              <Col className="d-flex justyfy-content-inline">
                <Form.Group controlId="startDate">
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Select start date"
                    className="m-2 p-2"
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
                <Form.Group controlId="endDate">
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Select end date"
                    className="m-2 p-2"
                    dateFormat="yyyy-MM-dd"
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="m-2 p-2"
                  variant="contained"
                >
                  Find Data
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Box>

      <div style={{ margin: "10px" }}>
        <Card style={{ backgroundColor: "#ffffff" }}>
          <CardContent>
            <div className="bg-light">
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
                          <StyledTableCell align="center">Sales Date</StyledTableCell>
                          <StyledTableCell align="center">Invoice Number </StyledTableCell>
                          <StyledTableCell align="center">Customer Name</StyledTableCell>
                          <StyledTableCell align="center">Total Amount</StyledTableCell>
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
    </>
  );
}

export default SalesReport;
