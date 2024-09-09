import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import CopyToClipboard from 'react-copy-to-clipboard';
import * as XLSX from 'xlsx';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import jsPDF from "jspdf";
import "jspdf-autotable";
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import Input from '@mui/material/Input';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { putCustomerLedgerData } from 'utils/api';
import { HttpStatusCodes } from 'utils/statusCodes';
import { toast } from 'react-toastify';
import Loading from "ui-component/Loading";


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#808080',
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

function CustomerBalance() {

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [editedRowData, setEditedRowData] = useState(null);
  const [id, setId] = useState([]);
  const [trade, setTrade] = useState('');
  const [boxSize, setBoxSize] = useState('');
  const [mrp, setMrp] = useState('');
  const [copied, setCopied] = useState(false);
  const [cusName, setCusName] = useState('');
  const [dueAmount, setDueAmmount] = useState(0);
  const [paidAmount, setPaidAmmount] = useState();
  const [ledgerId, setLedgerId] = useState();
  const [isCalling, setIsCalling] = useState(false);
  const [loading, setLoading] = useState(true);


  const columns = [
    { id: 'id', label: 'ID', align: 'center', minWidth: 70 },
    { id: 'customerID', label: 'Customer ID', align: 'center', minWidth: 170 },
    { id: 'customerName', label: 'Customer Name', align: 'center', minWidth: 170 },
    { id: 'totalAmount', label: 'Total Amount', align: 'center', minWidth: 170 },
    { id: 'paidAmount', label: 'Paid Amount', align: 'center', minWidth: 170 },
    { id: 'dueAmount', label: 'Due Amount', align: 'center', minWidth: 170 },
    { id: 'actions', label: 'Actions', align: 'center', minWidth: 170 }
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/customer_ledger');

      const transformedData = response.data?.data?.map((item) => ({
        id: item.id,
        customerID: item.customer_id || '--------',
        customerName: item.customer_name || '--------',
        totalAmount: item.total_balance || 0,
        paidAmount: item.total_paid || 0,
        dueAmount: item.total_due || '0.00',
      }));
      setData(transformedData);
      setLoading(false);
      const ids = transformedData.map((item) => item.id);
      setId(ids);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {

    fetchData();
  }, []);
  const rows = data;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //for age
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  // number input id

  const handleNumberChange1 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setTrade(inputValue);
  };

  const handleNumberChange2 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setBoxSize(inputValue);
  };

  const handleNumberChange3 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setMrp(inputValue);
  };
  const [boxPrice, setBoxPrice] = useState('');
  const handleNumberChange4 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setBoxPrice(inputValue);
  };
  const [quantity, setQuantity] = useState('');
  const handleNumberChange5 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setQuantity(inputValue);
  };
  // image uploading id
  const [selectedImage, setSelectedImage] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    displayImage(file);
  };




  //models
  const [open, setOpen] = React.useState(false);
  const handleOpen = (row) => {
    console.log("row ====== > ", row);
    setLedgerId(row?.id);
    setCusName(row?.customerName);
    setTrade(row?.totalAmount);
    setDueAmmount(row?.dueAmount);
    setPaidAmmount(row?.paidAmount);
    setOpen(true);

  };
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/medicine/add-medicine');
  };
  const handleButtonClick1 = () => {
    navigate('/inventory/manage-stock');
  };
  const handleButtonClick2 = () => {
    navigate('/inventory/out-of-stock');
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Customer Balance Data</title></head><body>"
    );
    printWindow.document.write("<h1>Customer Balance Data</h1>");
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
    link.setAttribute("download", "customer_balance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Balance Data");
    XLSX.writeFile(workbook, "customer_balance_data.xlsx");
  };

  // Function to export data to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Customer ID", dataKey: "customerID" },
      { header: "Customer Name", dataKey: "customerName" },
      { header: "Total Amount", dataKey: "totalAmount" },
      { header: "Paid Amount", dataKey: "paidAmount" },
      { header: "Due Amount", dataKey: "dueAmount" },
    ];
    const rows = sortedRows.map((row) => ({
      customerID: row.customerID,
      customerName: row.customerName,
      totalAmount: row.totalAmount,
      paidAmount: row.paidAmount,
      dueAmount: row.dueAmount,
    }));

    doc.text("Customer Balance Data", 10, 10);
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 20,
      theme: "grid",
      headStyles: {
        fillColor: [33, 150, 243],
      },
    });
    doc.save("customer_balance_data.pdf");
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

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    setIsCalling(true);

    const formData = new FormData();

    formData.append("customer_name", cusName);
    formData.append("total_balance", trade);
    formData.append("total_paid", paidAmount);
    formData.append("total_due", dueAmount);

    const response = await putCustomerLedgerData(ledgerId, formData);
    if (response?.status === HttpStatusCodes.OK) {
      toast.success("Data updated Successfully.");
      fetchData();
      setOpen(false);
    }

    setIsCalling(false);
  }

  return (
    <>
      <div style={{ margin: '10px' }}>
        <Stack direction='row' spacing={2} style={{ marginBottom: '15px' }}>
          <Button
            onClick={handleButtonClick}
            variant='contained'
            startIcon={<AddIcon />}
            style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            Add Customer
          </Button>
          <Button
            onClick={handleButtonClick1}
            variant='contained'
            startIcon={<MenuIcon />}
            style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            Manage Customer
          </Button>
          <Button
            onClick={handleButtonClick2}
            variant='contained'
            startIcon={<MenuIcon />}
            style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            Regular Customer
          </Button>
        </Stack>
        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent>
            <div className='bg-light'>
              <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                  <h3>Customer</h3>
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
                <Paper sx={{ width: 'auto', marginTop: '10px' }}>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 'auto' }} aria-label='customized table'>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align='center'>Customer ID</StyledTableCell>
                          <StyledTableCell align='center'>Customer Name</StyledTableCell>
                          <StyledTableCell align='center'>Total Amount</StyledTableCell>
                          <StyledTableCell align='center'>Paid Amount</StyledTableCell>
                          <StyledTableCell align='center'>Due Amount</StyledTableCell>
                          <StyledTableCell align='center'>Actions</StyledTableCell>
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

                          (sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            return (
                              <StyledTableRow key={row.id}>
                                {columns.slice(1).map(
                                  (
                                    column // Exclude the first column (ID)
                                  ) => (
                                    <StyledTableCell key={column.id} align={column.align}>
                                      {column.id === 'imageUrl' ? (
                                        row[column.id] ? (
                                          <img
                                            src={row[column.id]}
                                            alt='img'
                                            style={{ maxWidth: '50px', maxHeight: '50px', borderRadius: '50%' }} // Fixed typo: '50spx' to '50px'
                                          />
                                        ) : (
                                          'no image'
                                        )
                                      ) : (
                                        row[column.id]
                                      )}
                                      {column.id === 'actions' ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', width: '100px', alignItems: 'center' }}>
                                          <IconButton onClick={() => handleOpen(row)}>
                                            <EditIcon />
                                          </IconButton>
                                          <IconButton onClick={() => handlePrint(row.id)}>
                                            <PrintIcon />
                                          </IconButton>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                    </StyledTableCell>
                                  )
                                )}
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
                    component='div'
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
      <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={style}>
          <Typography id='modal-modal-description'>
            <Card style={{ backgroundColor: '#ffffff' }}>
              <CardContent>
                <div className='bg-light'>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={10} lg={10}>
                      <h3 className='text-primary'>Customer Balance</h3>
                    </Grid>
                  </Grid>
                  <hr />
                  <div style={{ marginBottom: '20px' }}>
                    <Grid container spacing={2}>
                      {/* First Column */}
                      <Grid item xs={12} md={6}>
                        <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete='off'>
                          <TextField
                            size='small'
                            id='outlined-textarea'
                            label='Customer Name'
                            placeholder='Supplier Name'
                            multiline
                            value={cusName}
                            onChange={(e) => setCusName(e.target.value)}
                          />
                          <TextField
                            size='small'
                            label='Total Amount'
                            type='number'
                            value={trade}
                            onChange={handleNumberChange1}
                            fullWidth
                          />
                          {/* <TextField
                            size='small'
                            label='Pay Amount'
                            type='number'
                            value={quantity}
                            onChange={handleNumberChange5}
                            fullWidth
                          /> */}
                        </Box>
                      </Grid>
                      {/* Second Column */}
                      <Grid item xs={12} md={6}>
                        <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete='off'>
                          <TextField
                            size='small'
                            label='Due Amount'
                            type='number'
                            value={dueAmount}
                            onChange={(e) => setDueAmmount(e.target.value)}
                            fullWidth
                          />
                          <TextField
                            size='small'
                            label='Paid Amount'
                            type='number'
                            value={paidAmount}
                            onChange={(e) => setPaidAmmount(e.target.value)}
                            fullWidth
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </div>
                  {/* <hr /> */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Stack spacing={2} direction='row'>
                      <Button
                        variant='contained'
                        onClick={handleModalSubmit}
                        disabled={isCalling}
                      >
                        Submit
                      </Button>
                      <Button onClick={handleClose} variant='outlined'>
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

export default CustomerBalance;
