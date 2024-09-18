import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Divider from '@mui/material/Divider';
import CopyToClipboard from 'react-copy-to-clipboard';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import Input from '@mui/material/Input';


function TodayPurchaseReport() {
    const data = [
        { id: 1, SalesName: '', InvoiceNumber: '', CustomerName: '', TotalAmount: '' }

    ];

    const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);


    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        // Define CSV headers
        const headers = [
            { label: 'SalesName', key: 'SalesName' },
            { label: 'InvoiceNumber', key: 'InvoiceNumber' },
            { label: 'CustomerName', key: 'CustomerName' },
            { label: 'TotalAmount', key: 'TotalAmount' }
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
        link.setAttribute('download', 'todays_sales_report_data.csv'); //short --stock----------------todays_sales_report----------------------------
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
        link.setAttribute('download', 'todays_sales_report_data.xlsx'); //----------------------todays_sales_report---------------------
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const pdf = new jsPDF();
        pdf.text('Manage Hospital Data', 10, 10);
        pdf.autoTable({
            head: [['SalesName', 'InvoiceNumber', 'CustomerName', 'TotalAmount']],
            body: data.map(item => Object.values(item)),
        });
        pdf.save('todays_sales_report_data.pdf'); //--------------------------------todays_sales_report---------------------------------------------------------------------
    };


    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div style={{ margin: '10px' }}>

            <Card style={{ backgroundColor: '#ffffff' }}>
                <CardContent>
                    <div className='bg-light'>
                        <Grid container spacing={2}>
                            <Grid xs={6} md={10} lg={10}>
                                <h3>Todays Sales Report</h3> {/* // -----------------------------name----------------- */}
                            </Grid>
                        </Grid>
                        <Divider sx={{ borderColor: 'blue', marginBottom: '5px' }} />
                        <Stack direction="row" spacing={2} style={{ marginBottom: '5px' }}>
                            <CopyToClipboard text="Your data to copy" onCopy={() => setCopied(true)}>
                                <Button variant="outlined">
                                    Copy
                                </Button>
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
                                            <TableCell>Customer Name</TableCell>
                                            <TableCell>Total Amount</TableCell>

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
                                                    <TableCell>{item.CustomerName}</TableCell>
                                                    <TableCell>{item.TotalAmount}</TableCell>


                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}




export default TodayPurchaseReport