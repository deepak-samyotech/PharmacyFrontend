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
import TextField from "@mui/material/TextField";
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
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { toast } from "react-toastify";
import Loading from "ui-component/Loading";


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
const tableContainer = {
  border: "1px solid #e0e0e0",
  borderRadius: "0px",
};

const tableHead = {
  backgroundColor: "#f5f5f5",
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const handleReturnSubmit = async (formData) => {
  try {
    // Make a POST request to your API endpoint
    const response = await axios.post(
      "http://localhost:8080/sale_return",
      formData // Send the formData state as the request body
    );
    // Optionally, you can reset the form data after successful submission
    setFormData({
      customerName: "",
      invoiceNumber: "",
      invoiceDate: "",
      type: "",
      medicineData: [
        {
          medicine: "",
          generic: "",
          saleQty: "",
          returnQty: 0,
          salePrice: "",
          deduction: 0,
          total: 0,
        },
      ],
      grandTotal: 0,
      grandDeduction: 0,
      totalReturn: 0,
    });
    // Optionally, you can display a success message or handle navigation
  } catch (error) {
    console.error("Error posting data:", error);
    // Optionally, you can display an error message to the user
  }
};
function SaleReturn() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [rtnQty, setRtnQty] = useState([]);
  const [deduction, setDeduction] = useState("");
  const [total, setTotal] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    customerName: "",
    invoiceNumber: "",
    sale_id: "",
    invoiceDate: "",
    type: "",
    medicineData: [
      {
        medicine_id: "",
        medicine: "",
        generic: "",
        saleQty: "",
        returnQty: 0,
        salePrice: "",
        deduction: 0,
        total: 0,
      },
    ],
    grandTotal: 0,
    grandDeduction: 0,
    totalReturn: 0,
  });


  const handleReturnSubmit = async (formData) => {
    try {

      const isValid = formData.medicineData.some(medicine => medicine.returnQty && medicine.returnQty > 0);
      if (!isValid) {
        toast.error("Please fill in the Return Qty for at least one medicine with a value greater than 0.");
        return;
      }

      console.log("FormData : ", formData);

      // Create a modified version of formData to include missing fields
      const modifiedFormData = {
        ...formData,
        invoiceDate: selectedInvoice.createDate, // Assuming selectedInvoice has the invoiceDate
        type: selectedInvoice.customerType, // Assuming selectedInvoice has the type
        medicineData: formData.medicineData.map(medicine => ({
          ...medicine,
          generic: medicine.genericName, // Assuming medicine has genericName
          saleQty: medicine.qty, // Assuming medicine has qty
          salePrice: medicine.medMrp, // Assuming medicine has medMrp
        })),
      };

      console.log("Modified form data : ", modifiedFormData);

      // Make a POST request to your API endpoint
      const response = await axios.post(
        "http://localhost:8080/sale_return",
        modifiedFormData // Send the modified formData state as the request body
      );

      // Optionally, you can reset the form data after successful submission
      setFormData({
        customerName: "",
        invoiceNumber: "",
        sale_id: "",
        invoiceDate: "",
        type: "",
        medicineData: [
          {
            medicine_id: "",
            medicine: "",
            generic: "",
            saleQty: "",
            returnQty: 0,
            salePrice: "",
            deduction: 0,
            total: 0,
          },
        ],
        grandTotal: 0,
        grandDeduction: 0,
        totalReturn: 0,
      });
      // Optionally, you can display a success message or handle navigation

      toast.success("Order Successfully returned!");
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error("Error posting data:", error);
      // Optionally, you can display an error message to the user
    }
  };

  const calculateTotalDeduction = (qty, mrp, deduction) => {
    const deductionAmount = (qty * mrp * deduction) / 100;
    return deductionAmount.toFixed(2);
  };
  const calculateTotal = (qty, mrp, deduction) => {
    const returnAmount =
      (qty * mrp * (100 - (deduction ? deduction : 0))) / 100;
    return returnAmount.toFixed(2);
  };

  // Function to update total whenever there is a change in return quantity or deduction
  const updateTotalForRow = (index) => {
    const { returnQty, medMrp, deduction } = formData.medicineData[index];
    const total = calculateTotal(returnQty, medMrp, deduction);

    setFormData((prevFormData) => {
      const updatedMedicineData = [...prevFormData.medicineData];
      updatedMedicineData[index].total = total;
      return {
        ...prevFormData,
        medicineData: updatedMedicineData,
      };
    });
  };

  const calculateGrandTotal = () => {
    let total = 0;
    formData.medicineData.forEach((medicine) => {
      total += parseFloat(
        (medicine.returnQty ? medicine.returnQty : 0) * medicine.medMrp
      );
    });
    return total ? total.toFixed(2) : 0;
  };

  const calculateGrandDeduction = () => {
    let totalGD = 0;
    const calculatedeductionTotal = () => {
      let totalD = 0;
      formData.medicineData.forEach((medicine) => {
        totalD += parseFloat(medicine.total ? medicine.total : 0);
      });
      return totalD ? totalD.toFixed(2) : 0;
    };
    const calculateGrandTotal = () => {
      let totalT = 0;
      formData.medicineData.forEach((medicine) => {
        totalT += parseFloat(
          (medicine.returnQty ? medicine.returnQty : 0) * medicine.medMrp
        );
      });
      return totalT ? totalT.toFixed(2) : 0;
    };

    return (totalGD = (
      calculateGrandTotal() - calculatedeductionTotal()
    ).toFixed(2));
  };

  const calculateReturnAmount = () => {
    const returnAmount = calculateGrandTotal() - calculateGrandDeduction();
    return returnAmount.toFixed(2);
  };

  const handleViewInvoiceTotal = () => {
    const returnAmount = calculateReturnAmount(); // Calculate return amount
    const updatedTotal = (selectedInvoice.totalAmount - returnAmount).toFixed(
      2
    ); // Update total
    setTotal(updatedTotal); // Update total state
  };

  const handleSetData = (event, index) => {
    const { name, value } = event.target;
    const updatedMedicineData = [...formData.medicineData];

    // Validate returnQty
    if (name === "returnQty") {
      const enteredQty = parseFloat(value);

      // Ensure returnQty is not less than 0 and not more than medicineItem.qty
      if (enteredQty < 0 || enteredQty > updatedMedicineData[index].qty) {
        toast.error(`Return Qty must be between 0 and ${updatedMedicineData[index].qty}`);
        return; // Stop the function from updating data if validation fails
      }
    }



    updatedMedicineData[index][name] = value;

    // Calculate total and deduction for the current row
    const { returnQty, medMrp, deduction } = updatedMedicineData[index];
    const total = calculateTotal(returnQty, medMrp, deduction);

    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        medicineData: updatedMedicineData,
      };

      // Update total and deduction for the current row
      updatedFormData.medicineData[index].total = total;

      // Calculate and update grandTotal
      updatedFormData.grandTotal = calculateGrandTotal();

      // Calculate and update grandDeduction
      updatedFormData.grandDeduction = calculateGrandDeduction();

      // Calculate and update totalReturn
      updatedFormData.totalReturn = calculateReturnAmount();

      return updatedFormData;
    });

    if (name === "returnQty" || name === "deduction") {
      updateTotalForRow(index);
    }
  };

  function updateQuantityAccordingToPreviousReturn(medicineData) {
    medicineData.forEach(medicine => {
      const qty = parseInt(medicine.qty) || 0;
      const returnQty = parseInt(medicine.prevReturnQty) || 0;
      medicine.qty = Math.max(qty - returnQty, 0).toString();
    });
    return medicineData;
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/manage_invoice"
      );
      const transformedData = response.data?.data?.map((item) => ({
        id: item.id,
        createDate: item.createDate,
        invoiceNumber: item.invoiceId,
        sale_id: item.sale_id,
        customerName: item.customerName,
        totalAmount: item.grand_total,
        customerType: item.customerType,
        medicineData: updateQuantityAccordingToPreviousReturn(item.medicineData),
      }));
      setData(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);




  const handleViewInvoice = (row) => {

    setSelectedInvoice(row);
    setFormData(row);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
    { id: "actions", label: "Actions", align: "center", minWidth: 170 },
  ];

  const rows = data;

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
                  <h3>Sales Return Report</h3>
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
                          <StyledTableCell>Create Date</StyledTableCell>
                          <StyledTableCell>Invoice Number</StyledTableCell>
                          <StyledTableCell>Customer Name</StyledTableCell>
                          <StyledTableCell>Total Amount</StyledTableCell>
                          <StyledTableCell>Return</StyledTableCell>
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
                                            <AssignmentReturnIcon />
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

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "75%",
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
          <div style={{ margin: "10px" }}>
            <Card
              style={{
                backgroundColor: "#ffffff",
                height: "calc(90vh - 20px)",
                overflow: "auto",
              }}
            >
              <CardContent>
                <div className="p-3">
                  {selectedInvoice && (
                    <>
                      <div>
                        <Grid container spacing={3}>
                          <Grid xs={6} md={12} lg={12}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                margin: "10px",
                                marginBottom: "10px",
                              }}
                            >
                              <TextField
                                id="filled-textarea"
                                label="Customer Name"
                                placeholder="Customer Name"
                                multiline
                                value={selectedInvoice.customerName}
                                variant="standard"
                              />
                              <TextField
                                id="filled-textarea"
                                label="Invoice No"
                                placeholder="Invoice No"
                                multiline
                                value={selectedInvoice.invoiceNumber}
                                variant="standard"
                              />
                              <TextField
                                id="filled-textarea"
                                label="Invoice Date"
                                placeholder="Invoice Date"
                                type="date"
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                                value={selectedInvoice.createDate}
                              />
                              <TextField
                                id="filled-textarea"
                                label="Type"
                                placeholder="Type"
                                multiline
                                value={selectedInvoice.customerType}
                                variant="standard"
                              />
                            </div>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          justifyContent="center"
                          style={{ marginTop: "20px" }}
                        >
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <TableContainer
                              component={Paper}
                              sx={tableContainer}
                            >
                              <Table>
                                <TableHead sx={tableHead}>
                                  <TableRow>
                                    <TableCell className="text-center">
                                      Medicine{" "}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      G.Name
                                    </TableCell>
                                    <TableCell className="text-center">
                                      Sale Qty
                                    </TableCell>
                                    <TableCell className="text-center">
                                      Return Qty
                                    </TableCell>
                                    <TableCell className="text-center">
                                      Sale Price
                                    </TableCell>
                                    <TableCell className="text-center">
                                      Deduction
                                    </TableCell>
                                    <TableCell className="text-center">
                                      Total
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {formData &&
                                    formData.medicineData.map(
                                      (medicineItem, index) => (
                                        <TableRow key={index}>
                                          <TableCell className="text-center">
                                            {medicineItem.medicine}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {medicineItem.genericName}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {medicineItem.qty}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <TextField
                                              id={`returnQty_${index}`}
                                              placeholder="Return Qty"
                                              variant="outlined"
                                              name="returnQty"
                                              value={medicineItem.returnQty}
                                              onChange={(e) =>
                                                handleSetData(e, index)
                                              }
                                              required
                                              error={medicineItem.returnQty === '' || medicineItem.returnQty < 0 || medicineItem.returnQty > medicineItem.qty} // Validation error
                                              helperText={
                                                medicineItem.returnQty === ''
                                                  ? 'Return Qty is required'
                                                  : medicineItem.returnQty < 0
                                                    ? 'Return Qty cannot be less than 0'
                                                    : medicineItem.returnQty > medicineItem.qty
                                                      ? `Return Qty cannot exceed ${medicineItem.qty}`
                                                      : ''
                                              }
                                            />
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {medicineItem.medMrp}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <TextField
                                              id={`deduction_${index}`}
                                              placeholder="Deduction"
                                              variant="outlined"
                                              name="deduction"
                                              value={medicineItem.deduction}
                                              onChange={(e) =>
                                                handleSetData(e, index)
                                              }
                                              error={medicineItem.deduction < 0 || medicineItem.deduction > 100}
                                              helperText={
                                                medicineItem.deduction < 0 ? 'Deduction ammount should be greater than 0' :
                                                  medicineItem.deduction > 100 ? 'Deduction ammount should be less than 100' : ''
                                              }
                                            />
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <TextField
                                              id={`total_${index}`}
                                              placeholder="Total"
                                              variant="outlined"
                                              name="total"
                                              value={medicineItem.total}
                                              onChange={(e) =>
                                                handleSetData(e, index)
                                              }
                                            />
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  {/* Add more rows as needed */}
                                </TableBody>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="text-center">
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleReturnSubmit(formData)}
                                      >
                                        Return
                                      </Button>
                                    </TableCell>
                                    <TableCell
                                      className="text-end font-weight-bold"
                                      colspan="8"
                                    >
                                      <div className="m-1 p-2">
                                        <TextField
                                          id="outlined-textarea"
                                          // label="Grand Total:"
                                          placeholder="Grand Total:"
                                          value={formData.grandTotal}
                                          // disabled
                                          multiline
                                        />
                                        {/* <div className="">Grand Total:</div>
                                  <TextField
                                    label="Total"
                                    variant="outlined"
                                    // value={total}
                                    disabled
                                  /> */}
                                      </div>
                                      <div className="m-1 p-2">
                                        <TextField
                                          id="outlined-textarea"
                                          // label="Total Deduction:"
                                          placeholder="Total Deduction:"
                                          value={formData.grandDeduction}
                                          multiline
                                        />
                                      </div>
                                      <div className="m-1 p-2">
                                        <TextField
                                          id="outlined-textarea"
                                          // label="Return Total:"
                                          placeholder="Return Total:"
                                          value={formData.totalReturn}
                                          multiline
                                          totalReturn
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default SaleReturn;
