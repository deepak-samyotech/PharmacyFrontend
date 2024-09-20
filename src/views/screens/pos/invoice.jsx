import { Button, Grid, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import './invoice.css';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import { getInvoiceData } from 'utils/api';
import { toast } from 'react-toastify';
import { HttpStatusCodes } from 'utils/statusCodes';

const Invoice = () => {
  const [generateInvoiceData, setGenerateInvoiceData] = useState();
  const [rows, setRows] = useState([]);
  const componentRef = useRef();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }));

  const Item2 = styled(Paper)(({ theme }) => ({
    backgroundColor: 'gainsboro',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: 'black'
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#808080',
      color: theme.palette.common.white,
      textAlign: 'Center'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
    }
  }));

  const fetchInvoiceData = async () => {
    const response = await getInvoiceData(window.location.href);

    if (response?.status === HttpStatusCodes.OK) {
      setGenerateInvoiceData(response?.data?.invoiceData);
      setRows(response?.data?.invoiceData?.medicineData);
    } else {
      toast.error(response?.data?.error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice'
  });

  return (
    <>
      <div ref={componentRef}>
        <Typography variant="h1" sx={{ textAlign: 'center', backgroundColor: 'black', color: 'white' }}>
          INVOICE
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div>
            <Typography variant="body2" sx={{ marginTop: '20px', marginLeft: '20px' }}>
              <p>Cusotmer Name : {generateInvoiceData?.customerName || '-----------'}</p>
              <p>Customer Type : {generateInvoiceData?.customerType}</p>
              <p>Phone No. : {generateInvoiceData?.contact}</p>
            </Typography>
          </div>
          <div>
            <Box sx={{ width: '100%' }}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
                <Grid item xs={6}>
                  <Item2>Invoice Id</Item2>
                </Grid>
                <Grid item xs={6}>
                  <Item>{generateInvoiceData?.invoiceId || 'null'}</Item>
                </Grid>
                <Grid item xs={6}>
                  <Item2>Date</Item2>
                </Grid>
                <Grid item xs={6}>
                  <Item>{generateInvoiceData?.createDate || 'null'}</Item>
                </Grid>
                <Grid item xs={6}>
                  <Item2>Amount Due</Item2>
                </Grid>
                <Grid item xs={6}>
                  <Item>{generateInvoiceData?.total_due || '0.00'}</Item>
                </Grid>
              </Grid>
            </Box>
          </div>
        </div>

        <div>
          <Paper sx={{ width: 'auto', marginTop: '10px' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 'auto' }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Product Name</StyledTableCell>
                    <StyledTableCell>Generic Name</StyledTableCell>
                    <StyledTableCell>MRP</StyledTableCell>
                    <StyledTableCell>Quantity</StyledTableCell>
                    <StyledTableCell>Price</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows &&
                    rows.map((row, index) => (
                      <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="center">{row?.medicine}</TableCell>
                        <TableCell align="center">{row?.genericName}</TableCell>
                        <TableCell align="center">{row?.medMrp}</TableCell>
                        <TableCell align="center">{row?.qty}</TableCell>
                        <TableCell align="center">{row?.product_total}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>

        <div>
          <Box sx={{ width: '43%', marginTop: '20px', marginLeft: 'auto' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
              <Grid item xs={6}>
                <Item2>Total</Item2>
              </Grid>
              <Grid item xs={6}>
                <Item>{generateInvoiceData?.grand_total || '0.00'}</Item>
              </Grid>
              <Grid item xs={6}>
                <Item2>Amount Paid</Item2>
              </Grid>
              <Grid item xs={6}>
                <Item>{generateInvoiceData?.total_paid || '0.00'}</Item>
              </Grid>
              <Grid item xs={6}>
                <Item2>Balance Due</Item2>
              </Grid>
              <Grid item xs={6}>
                <Item>{generateInvoiceData?.total_due || '0.00'}</Item>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>

      <div className="btn no-print ">
        <Button variant="contained" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </>
  );
};

export default Invoice;
