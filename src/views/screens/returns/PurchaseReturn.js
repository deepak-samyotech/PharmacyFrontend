// import React, { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Grid from "@mui/material/Grid";
// import Button from "@mui/material/Button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import axios from "axios";

// import Alert from "@mui/material/Alert";
// import AlertTitle from "@mui/material/AlertTitle";
// import { toast } from "react-toastify";
// import { fetchPurchaseReturn } from "utils/api";

// const PurchaseReturn = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [data, setData] = useState(null);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [failureMessage, setFailureMessage] = useState("");
//   const [showFields, setShowFields] = useState(false);
//   const [companyName, setCompanyName] = useState("");
//   const [supplierId, setSupplierId] = useState("");
//   const [invoice, setInvoice] = useState("");
//   const [inDate, setInDate] = useState("");
//   const [note, setNote] = useState("");
//   const [td, setTd] = useState("");
//   const [rQty, setRQty] = useState('');
//   const [total, setTotal] = useState('');
//   const [mrp, setMrp] = useState(0);
//   const [medicine, setMedicine] = useState([]);
//   const [purchaseQty, setPurchaseQty] = useState([]);
//   const [generic_name, setGeneric_name] = useState("");
//   const [form, setForm] = useState("");
//   const [trade_price, setTrade_pricel] = useState("");
//   const [barcode, setBarcode] = useState("");
//   const [errors, setErrors] = useState({});
//   const [medicineData, setMedicineData] = useState([]);


//   const handleSubmit = async () => {
//     try {
//       const invoiceResponse = await fetchPurchaseReturn(searchTerm);

//       console.log("invoiceResponse.data.PurchaseHistoryData", invoiceResponse);

//       // return;

//       const responseData = invoiceResponse?.data?.purchaseHistoryData[0];

//       if (responseData) {
//         setShowFields(true);
//         setCompanyName(responseData?.medicineData[0]?.supplier_name);
//         // setSupplierId(responseData[0].supplier_id);
//         setInvoice(responseData.invoice_no);
//         setInDate(responseData?.date?.split('T')[0]);
//         setNote(responseData?.details);
//         setMedicineData(responseData?.medicineData)
//         // setMedicine(responseData[0].product_name);
//         // setPurchaseQty(responseData[0].sale_qty);
//         // setMrp(responseData[0].mrp);
//         // setGeneric_name(responseData[0].generic_name);
//         // setForm(responseData[0].form);
//         // setTrade_pricel(responseData[0].trade_price);
//         // setBarcode(responseData[0].barcode);

//         setData(responseData);
//       } else {
//         setShowFields(false);
//       }
//     } catch (error) {
//       console.error("Error searching for invoice:", error);
//     }
//   };
//   const handleChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleBoxPriceCalculation = () => {
//     // Calculate box price based on MRP and box size
//     const calculatedBoxPrice =
//       parseFloat(mrp) * parseInt(rQty) -
//       (parseFloat(mrp) * parseInt(rQty) * parseFloat(td || 0)) / 100;
//     setTotal(calculatedBoxPrice.toFixed(2)); // Set the box price
//   };

//   useEffect(() => {
//     handleBoxPriceCalculation(); // Call the calculation function whenever MRP or box size changes
//   }, [mrp, rQty, td]);

//   const handleReturnSubmit = (e) => {
//     e.preventDefault();

//     const newErrors = {};
//     if (!rQty) newErrors.rQty = 'Return Quantity is required';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       // setIsCalling(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("sid", supplierId);
//     formData.append("supplier_name", companyName);
//     formData.append("invoice_no", invoice);
//     formData.append("date", inDate);
//     formData.append("details", note);
//     formData.append("product_name", medicine);
//     formData.append("mrp", mrp);
//     formData.append("sale_qty", purchaseQty);
//     formData.append("trade_price", rQty);
//     // formData.append('discount', discountType);
//     formData.append("total_amount", total);
//     formData.append("generic_name", generic_name);
//     formData.append("form", form);
//     formData.append("trade_price", trade_price);
//     formData.append("barcode", barcode);

//     axios
//       .post(`http://localhost:8080/purchase_return`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((response) => {
//         if (response.status === 200) {
//           setSuccessMessage("Purchase history added successfully.");
//           setFailureMessage("");
//           toast.success("Return Added successfully.")
//           setTimeout(() => {
//             window.location.reload();
//           }, 1000);
//         }
//       })
//       .catch((error) => {
//         console.error("Error appending barcode number to form data:", error);
//         setFailureMessage("Error adding Return. Please try again.");
//         console.error("Error adding Return:", error);
//         toast.error("Error adding Return. Please try again.")
//       });
//   };

//   const handleReturnQuantity = (e) => {
//     const value = parseInt(e.target.value, 10);

//     if (value >= 1 && value <= purchaseQty) {
//       setRQty(value);
//     } else if (value < 1) {
//       toast.error("Return quantinty should be grater than 1.")
//       setRQty('');
//     } else if (value > purchaseQty) {
//       toast.error("Return quantity should be less than equal to purchase quantity.")
//       setRQty('');
//     }
//   }

//   const handleTdChange = (e) => {
//     const value = parseInt(e.target.value, 10);

//     if (value >= 1 && value <= 100) {
//       setTd(value);
//     } else if (value < 1) {
//       toast.error("TD should be grater than 0.")
//       setTd('');
//     } else if (value > 100) {
//       toast.error("TD should be less than equal to 100.")
//       setTd('');
//     }
//   }

//   return (
//     <div style={{ margin: "10px" }}>
//       <Card style={{ backgroundColor: "#ffffff" }}>
//         <CardContent>
//           <div className="bg-light">
//             <Grid container spacing={2}>
//               <Grid item xs={6} md={10} lg={10}>
//                 <h3>Purchase Return</h3>
//               </Grid>
//             </Grid>
//             <hr />
//             <div>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <Box
//                     component="form"
//                     sx={{ "& .MuiTextField-root": { m: 1, width: "100%" } }}
//                     noValidate
//                     autoComplete="off"
//                     display="flex"
//                     alignItems="center" // Align items vertically centered
//                   >
//                     <TextField
//                       label="Invoice Number"
//                       variant="outlined"
//                       value={searchTerm}
//                       onChange={handleChange}
//                     />
//                     <Button
//                       variant="contained"
//                       onClick={handleSubmit}
//                       style={{ marginLeft: "10px" }}
//                     >
//                       Submit
//                     </Button>
//                   </Box>
//                 </Grid>
//               </Grid>
//             </div>

//             {showFields && (
//               <div className="mt-5 m-1">
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={3}>
//                     <TextField
//                       label="Company Name "
//                       variant="outlined"
//                       value={companyName}
//                       // onChange={(e) => setCompanyName(e.target.value)}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={3}>
//                     <TextField
//                       label="Invoice No"
//                       variant="outlined"
//                       value={invoice}
//                       // onChange={(e) => setInvoice(e.target.value)}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={3}>
//                     <TextField
//                       label="Invoice Date"
//                       variant="outlined"
//                       value={inDate}
//                       // onChange={(e) => setInDate(e.target.value)}
//                       fullWidth
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={3}>
//                     <TextField
//                       label="Note"
//                       variant="outlined"
//                       value={note}
//                       // onChange={(e) => setNote(e.target.value)}
//                       fullWidth
//                     />
//                   </Grid>
//                 </Grid>
//                 <hr />
//                 <div>
//                   <TableContainer>
//                     <Table>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>Medicine</TableCell>
//                           <TableCell>MRP</TableCell>
//                           <TableCell>Purchase Qty</TableCell>
//                           <TableCell>Return Qty</TableCell>
//                           <TableCell>TD(%)</TableCell>
//                           <TableCell>Total</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {/* <TableRow>
//                           <TableCell>{medicine}</TableCell>
//                           <TableCell>{mrp}</TableCell>
//                           <TableCell>{purchaseQty}</TableCell>
//                           <TableCell>
//                             <TextField
//                               id="outlined-number"
//                               type="number"
//                               value={rQty}
//                               onChange={(e) => handleReturnQuantity(e)}
//                               InputLabelProps={{
//                                 shrink: true,
//                               }}
//                               // inputProps={{
//                               //   min: 1,
//                                 // max: purchaseQty,
//                               // }}
//                               error={!!errors.rQty}
//                               helperText={errors.rQty}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               id="outlined-number"
//                               type="number"
//                               value={td}
//                               onChange={(e) => handleTdChange(e)}
//                               InputLabelProps={{
//                                 shrink: true,
//                               }}
//                               inputProps={{
//                                 min: 1,
//                                 max: 100,
//                               }}
//                             />
//                           </TableCell>
//                           <TableCell>
//                             <TextField
//                               id="outlined-number"
//                               type="number"
//                               disabled
//                               value={total}
//                               onChange={(e) => setTotal(e.target.value)}
//                               InputLabelProps={{
//                                 shrink: true,
//                               }}
//                             />
//                           </TableCell>
//                         </TableRow> */}

//                         {medicineData.map((item, index) => (
//                           <TableRow key={index}>
//                             <TableCell>{item?.product_name}</TableCell>
//                             <TableCell>{item?.mrp}</TableCell>
//                             <TableCell>{item?.purchase_qty}</TableCell>
//                             <TableCell>
//                               <TextField
//                                 id={`return-qty-${index}`}
//                                 type="number"
//                                 value={item.rQty || ''}
//                                 onChange={(e) => handleReturnQuantity(e, index)}
//                                 InputLabelProps={{
//                                   shrink: true,
//                                 }}
//                                 error={!!errors[`rQty-${index}`]}
//                                 helperText={errors[`rQty-${index}`]}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <TextField
//                                 id={`td-${index}`}
//                                 type="number"
//                                 value={item.td || ''}
//                                 onChange={(e) => handleTdChange(e, index)}
//                                 InputLabelProps={{
//                                   shrink: true,
//                                 }}
//                                 inputProps={{
//                                   min: 1,
//                                   max: 100,
//                                 }}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <TextField
//                                 id={`total-${index}`}
//                                 type="number"
//                                 disabled
//                                 value={item.total || ''}
//                                 InputLabelProps={{
//                                   shrink: true,
//                                 }}
//                               />
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                       {successMessage && (
//                         <Alert severity="success">
//                           <AlertTitle>Success</AlertTitle>
//                           {successMessage}
//                         </Alert>
//                       )}
//                       {failureMessage && (
//                         <Alert severity="error">
//                           <AlertTitle>Error</AlertTitle>
//                           {failureMessage}
//                         </Alert>
//                       )}
//                       <TableBody>
//                         <TableRow>
//                           <TableCell class="text-right">
//                             <Button
//                               variant="contained"
//                               color="primary"
//                               onClick={handleReturnSubmit}
//                             >
//                               Return
//                             </Button>
//                           </TableCell>
//                           <TableCell
//                             class="text-end font-weight-bold"
//                             colspan="4"
//                           >
//                             Grand Total:
//                           </TableCell>

//                           <TableCell>
//                             <TextField
//                               label="Total"
//                               variant="outlined"
//                               value={total}
//                               disabled
//                             />
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PurchaseReturn;


// New code
import React, { useMemo, useState } from "react";
import { Box, TextField, Card, CardContent, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, AlertTitle } from "@mui/material";
import { toast } from "react-toastify";
import { fetchPurchaseReturn, submitPurchaseReturn } from "utils/api";

const PurchaseReturn = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [purchaseData, setPurchaseData] = useState(null);
  const [medicineData, setMedicineData] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", content: "" });

  const handleSubmit = async () => {
    try {
      if (searchTerm === '') {
        return;
      }
      const response = await fetchPurchaseReturn(searchTerm);
      const responseData = response?.data?.purchaseHistoryData[0];

      console.log("responseData", responseData);

      if (responseData) {
        setPurchaseData(responseData);
        setMedicineData(responseData.medicineData.map(item => ({
          ...item,
          rQty: '',
          td: '',
          total: ''
        })));
      } else {
        toast.error("No purchase history found for this invoice number.");
      }
    } catch (error) {
      console.error("Error searching for invoice:", error);
      toast.error("Error fetching purchase history. Please try again.");
    }
  };

  const handleReturnQuantity = (e, index) => {
    const value = parseInt(e.target.value, 10);
    const maxQty = medicineData[index].purchase_qty;

    if (value >= 1 && value <= maxQty) {
      const updatedMedicineData = [...medicineData];
      updatedMedicineData[index].rQty = value;
      setMedicineData(updatedMedicineData);
      calculateTotal(index, updatedMedicineData);
    } else {
      toast.error(`Return quantity should be between 1 and ${maxQty}.`);
    }
  };

  const handleTdChange = (e, index) => {
    const value = parseInt(e.target.value, 10);

    if (value >= 0 && value <= 100) {
      const updatedMedicineData = [...medicineData];
      updatedMedicineData[index].td = value;
      setMedicineData(updatedMedicineData);
      calculateTotal(index, updatedMedicineData);
    } else {
      toast.error("Trade discount should be between 0 and 100.");
    }
  };

  const calculateTotal = (index, data) => {
    const item = data[index];
    const subtotal = parseFloat(item.mrp) * parseInt(item.rQty || 0);
    const discount = subtotal * (parseFloat(item.td || 0) / 100);
    const total = subtotal - discount;
    
    const updatedMedicineData = [...data];
    updatedMedicineData[index].total = total.toFixed(2);
    setMedicineData(updatedMedicineData);
  };

  const calculateGrandTotal = useMemo(() => {
    return medicineData.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);
  }, [medicineData]);

  const handleReturnSubmit = async () => {
    const newErrors = {};
    medicineData.forEach((item, index) => {
      if (!item.rQty) newErrors[`rQty-${index}`] = 'Return Quantity is required';
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const returnData = {
        invoice_no: purchaseData.invoice_no,
        date: purchaseData.date,
        details: purchaseData.details,
        grand_total: calculateGrandTotal,
        medicineData: medicineData.map(item => ({
          medicine_id: item._id,
          product_name: item.product_name,
          mrp: item.mrp,
          return_qty: item.rQty,
          trade_discount: item.td,
          total: item.total
        }))
      };

      await submitPurchaseReturn(returnData);
      
      setMessage({ type: "success", content: "Purchase return submitted successfully." });
      setTimeout(() => {
        setMessage({ type: "", content: "" });
      }, 2000)
      // toast.success("Purchase return submitted successfully.");
      setPurchaseData(null);
      setSearchTerm('');
    } catch (error) {
      console.error("Error submitting purchase return:", error);
      setMessage({ type: "error", content: "Error submitting purchase return. Please try again." });
      toast.error("Error submitting purchase return. Please try again.");
    }
  };

  return (
    <Card>
      <CardContent>
        <h3>Purchase Return</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <TextField
                label="Invoice Number"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                style={{ marginLeft: "10px" }}
              >
                Search
              </Button>
            </Box>
          </Grid>
        </Grid>

        {purchaseData && (
          <div className="mt-5">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Company Name"
                  variant="outlined"
                  value={purchaseData.medicineData[0]?.supplier_name || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Invoice No"
                  variant="outlined"
                  value={purchaseData.invoice_no}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Invoice Date"
                  variant="outlined"
                  value={purchaseData.date?.split('T')[0] || ''}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Note"
                  variant="outlined"
                  value={purchaseData.details}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>
            
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Medicine</TableCell>
                    <TableCell>MRP</TableCell>
                    <TableCell>Purchase Qty</TableCell>
                    <TableCell>Return Qty</TableCell>
                    <TableCell>TD(%)</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicineData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>{item.mrp}</TableCell>
                      <TableCell>{item.purchase_qty}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.rQty}
                          onChange={(e) => handleReturnQuantity(e, index)}
                          error={!!errors[`rQty-${index}`]}
                          helperText={errors[`rQty-${index}`]}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.td}
                          onChange={(e) => handleTdChange(e, index)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.total}
                          disabled
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-end font-weight-bold">
                      Grand Total:
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={calculateGrandTotal.toFixed(2)}
                        disabled
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleReturnSubmit}
              >
                Submit Return
              </Button>
            </Box>
          </div>
        )}

        {message.content && (
          <Alert severity={message.type} style={{ marginTop: "20px" }}>
            <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
            {message.content}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseReturn;