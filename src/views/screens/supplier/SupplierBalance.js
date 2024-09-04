/*eslint-disable*/
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
// import PrintIcon from "@mui/icons-material/Print";
// import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import CopyToClipboard from "react-copy-to-clipboard";
import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Input from "@mui/material/Input";
import TablePagination from "@mui/material/TablePagination";
import NavigationIcon from "@mui/icons-material/Navigation";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";

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
function SupplierBalance() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [editedRowData, setEditedRowData] = useState(null);
  const [copied, setCopied] = useState(false);

  //models
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const columns = [
    // { id: "id", label: "ID", align: "start", minWidth: 70 },
    { id: "supplierId", label: "Supplier ID", align: "center", minWidth: 170 },
    {
      id: "supplierName",
      label: "Supplier Name",
      align: "center",
      minWidth: 170,
    },
    {
      id: "totalAmount",
      label: "Total Amount",
      align: "center",
      minWidth: 170,
    },
    { id: "paidAmount", label: "Paid Amount", align: "center", minWidth: 70 },
    { id: "dueAmount", label: "Due Amount", align: "center", minWidth: 70 },
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/supplier_ledger"
        );
        const transformedData = response.data?.data?.map((item) => ({
          id: item.id,
          supplierId: item.supplier_id,
          supplierName: item.supplier_name,
          totalAmount: item.total_amount,
          paidAmount: item.total_paid,
          dueAmount: item.total_paid,
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const rows = data;

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
    link.setAttribute("download", "Supplier-Balance-Sheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    // Define workbook here
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Supplier Balance");

    // Create Excel file
    const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "blob" });
    const excelUrl = URL.createObjectURL(excelFile);

    // Trigger download
    const link = document.createElement("a");
    link.href = excelUrl;
    link.setAttribute("download", "supplier_balance_data.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const columns = [
      "Supplier ID",
      "Supplier Name",
      "Total Amount",
      "Paid Amount",
      "Due Amount",
    ];
    const rows = sortedRows.map((row) => [
      row.supplierId,
      row.supplierName,
      row.totalAmount,
      row.paidAmount,
      row.dueAmount,
    ]);

    const doc = new jsPDF();
    doc.text("Supplier Balance", 10, 10);
    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("supplier_balance.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Supplier Balance</title></head><body>"
    );
    printWindow.document.write("<h1>Supplier Balance</h1>");
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
    printWindow.document.write("</tbody></table>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const navigate = useNavigate();
  //add suppliers
  const handleAddSupplier = async () => {

    navigate("/supplier/add-supplier");
    // try {
    //   // Show form to add supplier
    //   const supplierId = window.prompt("Enter Supplier ID:");
    //   const supplierName = window.prompt("Enter Supplier Name:");
    //   const totalAmount = parseFloat(window.prompt("Enter Total Amount:"));
    //   const paidAmount = parseFloat(window.prompt("Enter Paid Amount:"));
    //   const dueAmount = parseFloat(window.prompt("Enter Due Amount:"));

    //   if (
    //     supplierId &&
    //     supplierName &&
    //     !isNaN(totalAmount) &&
    //     !isNaN(paidAmount) &&
    //     !isNaN(dueAmount)
    //   ) {
    //     const newSupplier = {
    //       supplier_id: supplierId,
    //       supplier_name: supplierName,
    //       total_amount: totalAmount,
    //       total_paid: paidAmount,
    //       total_due: dueAmount,
    //     };

    //     // Send request to add supplier
    //     await axios.post("http://localhost:8080/supplier_ledger", newSupplier);
    //     console.log("New supplier added:", newSupplier);

    //     // Update state with the new supplier
    //     setData((prevData) => [
    //       ...prevData,
    //       {
    //         id: prevData.length + 1, // Assuming you generate IDs this way
    //         ...newSupplier,
    //       },
    //     ]);
    //   } else {
    //     console.error("Invalid input for adding supplier.");
    //   }
    // } catch (error) {
    //   console.error("Error adding supplier:", error);
    // }
  };

  //edit suppliers
  const handleEditSupplier = (row) => {
    setEditedRowData(row);
    handleOpen();
  };

  const handleSaveEdit = async () => {
    if (!editedRowData) return;

    try {
      await axios.put(
        `http://localhost:8080/supplier_ledger/${editedRowData.id}`,
        editedRowData
      );
      setData((prevData) =>
        prevData.map((row) =>
          row.id === editedRowData.id ? editedRowData : row
        )
      );
      handleClose();
      toast.success("Data updated Successfully.");
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/supplier_ledger/${id}`);
      setData((prevData) => prevData.filter((row) => row.id !== id));
      toast.warning("Data deleted Successfully!");
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddSupplier}
        >
          Add Supplier
        </Button>
        <Button onClick={handleCopy}>Copy</Button>
        <Button onClick={handleExportCSV}>CSV</Button>
        <Button onClick={handleExportExcel}>Excel</Button>
        <Button onClick={handleExportPDF}>PDF</Button>
        <Button onClick={handlePrint}>Print</Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align}
                      sortDirection={orderBy === column.id ? order : false}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      No Data Found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <StyledTableRow key={row.id}>
                        {columns.map((column) => {
                          if (column.id === "actions") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleEditSupplier(row)}
                                  style={{ marginRight: "5px" }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => handleDeleteSupplier(row.id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            );
                          }
                          return (
                            <StyledTableCell
                              key={column.id}
                              align={column.align}
                            >
                              {row[column.id]}
                            </StyledTableCell>
                          );
                        })}
                      </StyledTableRow>
                    ))
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={sortedRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

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
                      <h3 className="text-primary">Edit Supplier</h3>
                    </Grid>
                    <Grid item xs={6} md={2} lg={2} >
                      Wednesday 7th of February 2024 04:37:08 PM
                    </Grid>
                  </Grid>
                  <hr />
                  <div style={{ marginBottom: "20px" }}>
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
                            label="Supplier ID"
                            value={editedRowData?.supplierId}
                            onChange={(e) =>
                              setEditedRowData({
                                ...editedRowData,
                                supplierId: e.target.value,
                              })
                            }
                            fullWidth
                            margin="normal"
                          />

                          <TextField
                            label="Supplier Name"
                            value={editedRowData?.supplierName}
                            onChange={(e) =>
                              setEditedRowData({
                                ...editedRowData,
                                supplierName: e.target.value,
                              })
                            }
                            fullWidth
                            margin="normal"
                          />

                          <TextField
                            label="Total Amount"
                            value={editedRowData?.totalAmount}
                            onChange={(e) =>
                              setEditedRowData({
                                ...editedRowData,
                                totalAmount: e.target.value,
                              })
                            }
                            fullWidth
                            margin="normal"
                          />

                          
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
                            label="Paid Amount"
                            value={editedRowData?.paidAmount}
                            onChange={(e) =>
                              setEditedRowData({
                                ...editedRowData,
                                paidAmount: e.target.value,
                              })
                            }
                            fullWidth
                            margin="normal"
                          />

                          <TextField
                            label="Due Amount"
                            value={editedRowData?.dueAmount}
                            onChange={(e) =>
                              setEditedRowData({
                                ...editedRowData,
                                dueAmount: e.target.value,
                              })
                            }
                            fullWidth
                            margin="normal"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </div>
                  {/* <hr /> */}
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
                        onClick={handleSaveEdit}
                      >
                        Save Changes
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

    </div>
  );
}

export default SupplierBalance;
