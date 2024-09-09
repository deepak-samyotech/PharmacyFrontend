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
import * as XLSX from "xlsx";
import "jspdf-autotable";
import jsPDF from "jspdf";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { tableCellClasses } from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function PurchaseReturnReport() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);


  const columns = [
    { id: "invoiceNumber", label: "Invoice Number", align: "center", minWidth: 170 },
    { id: "supplierName", label: "Supplier Name", align: "center", minWidth: 170 },
    { id: "returnDate", label: "Return Date", align: "center", minWidth: 170 },
    { id: "totalAmount", label: "Total Amount", align: "center", minWidth: 170 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/purchase_return");
        const transformedData = response.data?.data?.map((item) => ({
          id: item.id,
          invoiceNumber: item.invoice_no,
          supplierName: item.supplier_name,
          returnDate: item.return_date,
          totalAmount: item.total_amount,
        }));
        setData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
    link.setAttribute("download", "purchaseReturn.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Return");
    XLSX.writeFile(workbook, "purchaseReturn.xlsx");
  };

  const handleExportPDF = () => {
    const columns = ["Supplier Name", "Invoice Number", "Return Date", "Total Amount"];
    const rows = sortedRows.map((row) => [
      row.supplierName,
      row.invoiceNumber,
      row.returnDate,
      row.totalAmount,
    ]);

    const doc = new jsPDF();
    doc.text("Purchase Return", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("purchaseReturn.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Purchase Return</title></head><body>"
    );
    printWindow.document.write("<h1>Purchase Return</h1>");
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
  return (
    <div style={{ margin: "10px" }}>
      <Card style={{ backgroundColor: "#ffffff" }}>
        <CardContent>
          <div className="bg-light">
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>Purchase Return Report</h3>{" "}
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
                        <StyledTableCell align="center">Invoice Number </StyledTableCell>
                        <StyledTableCell align="center">Supplier Name</StyledTableCell>
                        <StyledTableCell align="center">Return Date</StyledTableCell>
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

export default PurchaseReturnReport;
