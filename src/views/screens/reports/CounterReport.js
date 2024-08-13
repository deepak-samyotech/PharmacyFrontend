import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CopyToClipboard from 'react-copy-to-clipboard';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import Input from '@mui/material/Input';
import TablePagination from '@mui/material/TablePagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Navigate } from 'react-router';


function CounterReport() {


    //for age ------------select counter-------
    const [age, setAge] = useState('');

    const handleChange1 = (event) => {
        setAge(event.target.value);
    };

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const data = [
        { id: 1, SalesName: '', InvoiceNumber: '', SupplierName: '', TotalAmount: '', Counter: '', EntryName: '' }

    ];

    const [copied, setCopied] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        // Define CSV headers
        const headers = [
            { label: 'SalesName', key: 'SalesName' },
            { label: 'InvoiceNumber', key: 'InvoiceNumber' },
            { label: 'SupplierName', key: 'SupplierName' },
            { label: 'TotalAmount', key: 'TotalAmount' },
            { label: 'Counter', key: 'Counter' },
            { label: 'EntryName', key: 'EntryName' }
        ];

        // Create CSV data
        const csvData = [
            headers,
            ...data.map(item => Object.values(item)),
        ];

        // Create CSV file
        const csvFile = new Blob([csvData.map(row => row.join(',')).join('\n')], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvFile);

        // Trigger download
        const link = document.createElement('a');
        link.href = csvUrl;
        link.setAttribute('download', 'sales_report_data.csv'); //short --stock----------------sales_report----------------------------
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        // Create Excel workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data), 'Manage Doctor Data'); //-----------------------manage----------

        // Create Excel file
        const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'blob' });
        const excelUrl = URL.createObjectURL(excelFile);

        // Trigger download
        const link = document.createElement('a');
        link.href = excelUrl;
        link.setAttribute('download', 'sales_report_data.xlsx'); //----------------------sales_report---------------------
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const pdf = new jsPDF();
        pdf.text('Manage Hospital Data', 10, 10);
        pdf.autoTable({
            head: [['SalesName', 'InvoiceNumber', 'SupplierName', 'TotalAmount', 'Counter', 'EntryName']],
            body: data.map(item => Object.values(item)),
        });
        pdf.save('sales_report_data.pdf'); //--------------------------------sales_report---------------------------------------------------------------------
    };

    //--------------------range date----------------------------
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const handleSubmit = () => {
        if (startDate && endDate) {
            alert(`Selected Date Range: ${startDate} to ${endDate}`);
        } else {
            alert('Please select both start and end dates.');
        }
        Navigate('/report/counter-report');
    };


    const [searchTerm, setSearchTerm] = useState('');

    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };



    return (

        <>
            {/* --------------------range date---------------------------- */}
            <Grid container spacing={2}>
                <Grid xs={6} md={10} lg={10}>
                    <h3>Counter Report</h3> {/* // -----------------------------name----------------- */}
                </Grid>
            </Grid>
            <Box style={{ justifyContent: 'space-evenly', display: 'flex' }}>
                <TextField
                    label='Start Date'
                    type='date'
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

                <TextField
                    label='End Date'
                    type='date'
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                /> 

                <FormControl style={{ width: '450px' }}>

                    <InputLabel id='demo-simple-select-label' >Select Counter</InputLabel>
                    <Select labelId='demo-simple-select-label' id='demo-simple-select' value={age} label='Age' onChange={handleChange1}>
                        <MenuItem value={'CounterOne'}>Counter One</MenuItem>
                        <MenuItem value={'CounterTwo'}>Counter Two</MenuItem>
                        <MenuItem value={'CounterThree'}>Counter Three</MenuItem>
                        <MenuItem value={'CounterFour'}>Counter Four</MenuItem>
                        <MenuItem value={'CounterFive'}>Counter five</MenuItem>

                    </Select>
                </FormControl>


                <div style={{ paddingTop: '8px' }}>
                    <Button onClick={handleSubmit} variant='contained'>Submit</Button>
                </div>



            </Box>


            <div style={{ margin: '10px' }}>

                <Card style={{ backgroundColor: '#ffffff' }}>
                    <CardContent>
                        <div className='bg-light'>

                            <Divider sx={{ borderColor: 'blue', marginBottom: '5px' }} />
                            <Stack direction='row' spacing={2} style={{ marginBottom: '5px' }}>
                                <CopyToClipboard text='Your data to copy' onCopy={() => setCopied(true)}>
                                    <Button variant='outlined'>
                                        Copy
                                    </Button>
                                </CopyToClipboard>
                                <Button variant='outlined' onClick={handleExportCSV}>
                                    CSV
                                </Button>
                                <Button variant='outlined' onClick={handleExportExcel}>
                                    Excel
                                </Button>
                                <Button variant='outlined' onClick={handleExportPDF}>
                                    PDF
                                </Button>
                                <Button variant='outlined' onClick={handlePrint}>
                                    Print
                                </Button>
                                <Input
                                    placeholder='Search'
                                    style={{ marginLeft: 'auto', marginRight: '15px' }}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Stack>
                            <div>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow style={{ backgroundColor: '#E0FFFF', }}>
                                                <TableCell> Sales Name</TableCell>
                                                <TableCell>Invoice Number </TableCell>
                                                <TableCell>Supplier Name</TableCell>
                                                <TableCell>Total Amount</TableCell>
                                                <TableCell>Counter</TableCell>
                                                <TableCell>Entry Name</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data
                                                .filter((item) =>
                                                    Object.values(item)
                                                        .join(' ')
                                                        .toLowerCase()
                                                        .includes(searchTerm.toLowerCase())
                                                )
                                                .map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.SalesName}</TableCell>
                                                        <TableCell>{item.InvoiceNumber}</TableCell>
                                                        <TableCell>{item.SupplierName}</TableCell>
                                                        <TableCell>{item.TotalAmount}</TableCell>
                                                        <TableCell>{item.Counter}</TableCell>
                                                        <TableCell>{item.EntryName}</TableCell>


                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component='div'
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}




export default CounterReport