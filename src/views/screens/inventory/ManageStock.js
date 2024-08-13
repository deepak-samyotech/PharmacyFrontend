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
import { useNavigate } from "react-router";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import axios from "axios";

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
function ManageStock() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);

  const columns = [
    // { id: 'id', label: 'ID', align: 'start', minWidth: 70 },
    {
      id: "medicineName",
      label: "Medicine Name",
      align: "center",
      minWidth: 170,
    },
    {
      id: "genericName",
      label: "Generic Name",
      align: "center",
      minWidth: 170,
    },
    { id: "company", label: "Company", align: "center", minWidth: 170 },
    { id: "stock", label: "Stock", align: "center", minWidth: 170 },
    { id: "soldQty", label: "Sold Qty", align: "center", minWidth: 170 },
    {
      id: "sellingPrice",
      label: "Selling Price",
      align: "center",
      minWidth: 170,
    },
    {
      id: "supplierPrice",
      label: "Supplier Price",
      align: "center",
      minWidth: 170,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/medicine");

        const transformedData = response.data?.data?.map((item) => ({
          id: item.id,
          medicineName: item.product_name || 0,
          genericName: item.generic_name || 0,
          company: item.supplier_name || 0,
          stock: item.instock || 0,
          soldQty: item.sale_qty || 0,
          sellingPrice: item.mrp || 0,
          supplierPrice: item.trade_price || 0,
        }));
        setData(transformedData);
        // const ids = transformedData.map((item) => item.id);
        // setId(ids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const rows = data;

  // --------------------page routing-------------------

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/medicine/add-medicine");
  };
  const handleButtonClick1 = () => {
    navigate("/inventory/manage-stock");
  };
  const handleButtonClick2 = () => {
    navigate("/inventory/out-of-stock");
  };
  const handleButtonClick3 = () => {
    navigate("/inventory/soon-expiring");
  };
  const handleButtonClick4 = () => {
    navigate("/inventory/expire-medicine");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Stock Management</title></head><body>"
    );
    printWindow.document.write("<h1>Stock Management</h1>");
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
    link.setAttribute("download", "StockManagement.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Management");
    XLSX.writeFile(workbook, "StockManagement.xlsx");
  };

  // Function to export data to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Medicine Name", dataKey: "medicineName" },
      { header: "Generic Name", dataKey: "genericName" },
      { header: "Company", dataKey: "company" },
      { header: "Stock", dataKey: "stock" },
      { header: "Sold Qty", dataKey: "soldQty" },
      { header: "Selling Price", dataKey: "sellingPrice" },
      { header: "Supplier Price", dataKey: "supplierPrice" },
    ];
    const rows = sortedRows.map((row) => ({
      medicineName: row.medicineName,
      genericName: row.genericName,
      company: row.company,
      stock: row.stock,
      soldQty: row.soldQty,
      sellingPrice: row.sellingPrice,
      supplierPrice: row.supplierPrice,
    }));

    doc.text("Stock Management", 10, 10);
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 20,
      theme: "grid",
      headStyles: {
        fillColor: [33, 150, 243],
      },
    });
    doc.save("StockManagement.pdf");
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
    <div style={{ margin: "10px" }}>
      <Stack direction="row" spacing={2} style={{ marginBottom: "15px" }}>
        <Button
          onClick={handleButtonClick}
          variant="contained"
          startIcon={<AddIcon />}
          style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
        >
          Add Medicine Stock
        </Button>
        <Button
          onClick={handleButtonClick1}
          variant="contained"
          startIcon={<MenuIcon />}
          style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
        >
          Manage Medicine Stock
        </Button>
        <Button
          onClick={handleButtonClick2}
          variant="contained"
          startIcon={<MenuIcon />}
          style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
        >
          Out Of Stock
        </Button>
        <Button
          onClick={handleButtonClick3}
          variant="contained"
          startIcon={<MenuIcon />}
          style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
        >
          Soon Expire
        </Button>
        <Button
          onClick={handleButtonClick4}
          variant="contained"
          startIcon={<MenuIcon />}
          style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
        >
          Expire Medicine
        </Button>
      </Stack>
      <Card style={{ backgroundColor: "#ffffff" }}>
        <CardContent>
          <div className="bg-light">
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>Manage Medicine Stock</h3>
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
                          Medicine Name
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Generic Name
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Company
                        </StyledTableCell>
                        <StyledTableCell align="center">Stock</StyledTableCell>
                        <StyledTableCell align="center">
                          Sold Qty
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Selling Price
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Supplier Price
                        </StyledTableCell>
                        {/* <StyledTableCell align='center'>Actions</StyledTableCell> */}
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
  );
}

export default ManageStock;
