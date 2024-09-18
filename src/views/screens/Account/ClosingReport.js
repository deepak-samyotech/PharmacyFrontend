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
import Loading from "ui-component/Loading";
import { fetchClosingData, handleRetry } from 'utils/api';
import InternalServerError from 'ui-component/InternalServerError';


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

function ClosingReport() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [editedRowData, setEditedRowData] = useState(null);
  const [id, setId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  const columns = [
    { id: 'id', label: 'ID', align: 'center', minWidth: 70 },
    { id: 'date', label: 'Date', align: 'center', minWidth: 170 },
    { id: 'openingBalance', label: 'Opening Balance', align: 'center', minWidth: 170 },
    { id: 'cashIn', label: 'Cash In', align: 'center', minWidth: 170 },
    { id: 'cashOut', label: 'Cash Out', align: 'center', minWidth: 170 },
    { id: 'cashInHand', label: 'Cash In Hand', align: 'center', minWidth: 170 },
    { id: 'closingBalance', label: 'Closing Balance', align: 'center', minWidth: 170 },
    { id: 'adjustment', label: 'Adjustment', align: 'center', minWidth: 170 }
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClosingData();

        console.log('response.data213131312', response?.data);

        const transformedData = response?.data?.data?.map((item) => ({
          id: item.id,
          date: item.date,
          openingBalance: item.opening_balance,
          cashIn: item.cash_in,
          cashOut: item.cash_out,
          cashInHand: item.cash_in_hand,
          closingBalance: item.closing_balance,
          adjustment: item.adjustment,
        }));
        setData(transformedData);
        setLoading(false);
        console.log('response data----------->', transformedData);
        // const ids = transformedData.map((item) => item.id);
        // console.log('IDs:', ids);
        // setId(ids);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      }
    };

    fetchData();
  }, []);
  console.log('set===-->', data);
  const rows = data || [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 


  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/account/closing');
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Closing Report Data</title></head><body>"
    );
    printWindow.document.write("<h1>Closing Report Data</h1>");
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
    link.setAttribute("download", "Closing_report_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportExcel = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Closing Report  Data");
    XLSX.writeFile(workbook, "Closing_report_data.xlsx");
  };
  
  // Function to export data to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: "Date", dataKey: "date" },
      { header: "Opening Balance", dataKey: "openingBalance" },
      { header: "Cash In", dataKey: "cashIn" },
      { header: "Cash Out", dataKey: "cashOut" },
      { header: "Cash In Hand", dataKey: "cashInHand" },
      { header: "Closing Balance", dataKey: "closingBalance" },
      { header: "Adjustment", dataKey: "adjustment" },

    ];
    const rows = sortedRows?.map((row) => ({
      date: row.date,
      openingBalance: row.openingBalance,
      cashIn: row.cashIn,
      cashOut: row.cashOut,
      cashInHand: row.cashInHand,
      closingBalance: row.closingBalance,
      adjustment: row.adjustment,

    }));
  
    doc.text("Closing Report Data", 10, 10);
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 20,
      theme: "grid",
      headStyles: {
        fillColor: [33, 150, 243],
      },
    });
    doc.save("Closing_report_data.pdf");
  };
  
  // Function to filter rows based on search term
  const filteredRows = rows?.filter((row) =>
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
    rowsPerPage - Math.min(rowsPerPage, sortedRows?.length - page * rowsPerPage);
  
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
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis?.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
  }


  if (error) {
    return <InternalServerError onRetry={handleRetry} />; // Show error page if error occurred
  }

  return (
    <div style={{ margin: '10px' }}>
      <Stack direction='row' spacing={2} style={{ marginBottom: '15px' }}>
        <Button
          onClick={handleButtonClick}
          variant='contained'
          startIcon={<AddIcon />}
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
        >
          Add Closing
        </Button>
      </Stack>
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardContent>
          <div className='bg-light'>
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>Closing Report</h3>
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
                        <StyledTableCell align='center'>Date</StyledTableCell>
                          <StyledTableCell align='center'>Opening Balance</StyledTableCell>
                          <StyledTableCell align='center'>Cash In</StyledTableCell>
                          <StyledTableCell align='center'>Cash Out</StyledTableCell>
                          <StyledTableCell align='center'>Cash In hand</StyledTableCell>
                          <StyledTableCell align='center'>Closing Balance</StyledTableCell>
                          <StyledTableCell align='center'>Adjustment</StyledTableCell>
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
                        (sortedRows?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={columns.length} align="center">
                              No Data Found
                            </TableCell>
                          </TableRow>
                        ) : 
                          sortedRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
  );
}

export default ClosingReport;
