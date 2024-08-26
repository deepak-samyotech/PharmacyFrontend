/*eslint-disable*/
import {
  Grid,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import React from 'react';
import { Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const invoice = () => {
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

  
    
    const location = useLocation();

    const { generateInvoice } = location.state || {};

    console.log("generateInvoice : ", generateInvoice);

    const rows = generateInvoice?.medicineData;
    

  return (
    <>
      <Typography variant="h1" sx={{ textAlign: 'center', backgroundColor: 'black', color: 'white' }}>
        INVOICE
      </Typography>

      <Typography variant="body2" sx={{ marginTop: '20px', marginLeft: '20px' }}>
        <p>Cusotmer Name : {generateInvoice.customerName}</p>
        <p>Customer Type : {generateInvoice.customerType}</p>
        <p>Phone No. : {generateInvoice.contact}</p>
      </Typography>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div>
          <Typography variant="h3" sx={{ marginLeft: '20px' }}>
            Company Name
          </Typography>
        </div>
        <div>
          <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
              <Grid item xs={6}>
                <Item2>Invoice #</Item2>
              </Grid>
              <Grid item xs={6}>
                              <Item>{ generateInvoice.invoiceId }</Item>
              </Grid>
              <Grid item xs={6}>
                <Item2>Date</Item2>
              </Grid>
              <Grid item xs={6}>
                              <Item>{ generateInvoice.createDate }</Item>
              </Grid>
              <Grid item xs={6}>
                <Item2>Amount Due</Item2>
              </Grid>
              <Grid item xs={6}>
                <Item>{ generateInvoice.total_due}</Item>
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
                {rows.map((row, index) => (
                  <TableRow key={row.index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='center' >Demo</TableCell>
                    <TableCell align='center'>{row.genericName}</TableCell>
                    <TableCell align="center">{row.medMrp}</TableCell>
                    <TableCell align="center">{row.qty}</TableCell>
                    <TableCell align="center">{row.product_total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* <TablePagination
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
          /> */}
        </Paper>
          </div>
          
          <div >
          <Box sx={{ width: '43%', marginTop:"20px", marginLeft:"auto"}}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 1 }}>
              <Grid item xs={6}>
                <Item2>Total</Item2>
              </Grid>
              <Grid item xs={6}>
                          <Item>{ generateInvoice.grand_total }</Item>
              </Grid>
              <Grid item xs={6}>
                <Item2>Amount Paid</Item2>
              </Grid>
              <Grid item xs={6}>
                <Item>{ generateInvoice.total_paid }</Item>
              </Grid>
              <Grid item xs={6}>
                <Item2>Balance Due</Item2>
              </Grid>
              <Grid item xs={6}>
                <Item>{ generateInvoice.total_due}</Item>
              </Grid>
            </Grid>
          </Box>
        </div>  
    </>
  );
};

export default invoice;
