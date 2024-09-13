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
import "jspdf-autotable";
import jsPDF from "jspdf";
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
import Loading from "ui-component/Loading";
import { fetchSaleReturnData, handleRetry } from "utils/api";
import InternalServerError from "ui-component/InternalServerError";


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


function SalesReturnReport() {

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const columns = [
    {
      id: "invoiceNumber",
      label: "Invoice Number",
      align: "center",
      minWidth: 170,
    },
    {
      id: "sale_id",
      label: "Sale ID",
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
      id: "returnDate",
      label: "Return Date",
      align: "center",
      minWidth: 170,
    },
    {
      id: "grandTotal",
      label: "Total Amount",
      align: "center",
      minWidth: 170,
    },
    {
      id: "grandDeduction",
      label: "Total Deducation",
      align: "center",
      minWidth: 170,
    },
    {
      id: "entryName",
      label: "Entry Name",
      align: "center",
      minWidth: 170,
    },
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSaleReturnData();
        const transformedData = response.data?.data?.map((item) => ({
          id: item.id,
          invoiceNumber: item.invoiceNumber,
          sale_id: item.sale_id,
          customerName: item.customerName,
          returnDate: item.returnDate,
          grandTotal: item.grandTotal,
          grandDeduction: item.grandDeduction,
          entryName: item.entryName,
        }));
        setData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };

    fetchData();
  }, []);

  const rows = data;


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
    link.setAttribute("download", "salesReturn.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Return");
    XLSX.writeFile(workbook, "salesReturn.xlsx");
  };

  const handleExportPDF = () => {
    const columns = ["Invoice Number", "Sale ID", "Customer Name", "Return Date", "Total Amount", "Total Deduction", "Entry Name"];
    const rows = sortedRows.map((row) => [
      row.invoiceNumber,
      row.sale_id,
      row.customerName,
      row.returnDate,
      row.grandTotal,
      row.grandDeduction,
      row.entryName,

    ]);

    const doc = new jsPDF();
    doc.text("Sales Return", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("salesreturn.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Sales Return Report</title></head><body>"
    );
    printWindow.document.write("<h1>Sales Return Report</h1>");
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
    <div style={{ margin: '10px' }}>

      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardContent>
          <div className='bg-light'>
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>Sales Return Report</h3> {/* // -----------------------------name----------------- */}
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
                        <StyledTableCell align="center">Invoice Number</StyledTableCell>
                        <StyledTableCell align="center">Sale ID</StyledTableCell>
                        <StyledTableCell align="center">Customer Name</StyledTableCell>
                        <StyledTableCell align="center">Return Date</StyledTableCell>
                        <StyledTableCell align="center">Total Amount</StyledTableCell>
                        <StyledTableCell align="center">Total Deducation</StyledTableCell>
                        <StyledTableCell align="center">Entry Name</StyledTableCell>
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
  );
}




export default SalesReturnReport