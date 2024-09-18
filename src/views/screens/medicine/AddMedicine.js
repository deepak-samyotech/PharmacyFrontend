/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import { useBarcode } from '@createnextapp/react-barcode'; //--------barcode
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Swal from 'sweetalert2';
import { fetchSupplierData, handleRetry, postMedicineData } from 'utils/api';
import InternalServerError from 'ui-component/InternalServerError';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const AddMedicine = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [failureMessage, setFailureMessage] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('');
  const [tradePrice, setTradePrice] = useState('');
  const [boxSize, setBoxSize] = useState('');
  const [expDate, setExpDate] = useState('');
  const [sideEffect, setSideEffect] = useState('');
  const [productName, setProductName] = useState('');
  const [barcodeNum, setBarcodeNum] = useState('');
  const [mrp, setMrp] = useState('');
  const [boxPrices, setBoxPrices] = useState('');
  const [quantity, setQuantity] = useState('');
  const [ShortQty, setShortQty] = useState('');
  const [form, setForm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Yes');
  const [discountType, setDiscountType] = useState('Yes'); // Add this line
  const [supplierList, setSupplierList] = useState([]); // State to store the list of suppliers
  const [selectedSupplier, setSelectedSupplier] = useState(''); // State to store the selected supplier
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSupplierData();
        // Check the structure of response.data
        const supplierDataList = response?.data?.data?.suppliers;

        // Assuming data is in the form of { data: [{ s_id, s_name }, ...] }
        const transformedData = supplierDataList?.map((item) => ({
          supplier_id: item.suppler_Id,
          supplier_name: item.supplier_name,
        }));
        // Update state only if transformedData is an array
        if (Array.isArray(transformedData)) {
          setSupplierList(transformedData);
        } else {
          console.error('Data is not in the expected format:', transformedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
      }
    };

    fetchData();
  }, []);

  const handleSupplierChange = (event) => {
    const selectedSupplierObj = supplierList.find((supplier) => supplier.supplier_id === event.target.value);
    setCompanyName(selectedSupplierObj.supplier_name);
    setSelectedSupplier(event.target.value);
  };

  const handleBoxPriceCalculation = () => {
    // Calculate box price based on MRP and box size
    const calculatedBoxPrice = parseFloat(mrp || 0) * parseInt(boxSize || 0);
    setBoxPrices(calculatedBoxPrice.toFixed(2)); // Set the box price
  };

  useEffect(() => {
    handleBoxPriceCalculation(); // Call the calculation function whenever MRP or box size changes
  }, [mrp, boxSize]);


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (validateForm()) {
        const formData = new FormData();
        formData.append('supplier_id', selectedSupplier);
        formData.append('supplier_name', companyName);
        formData.append('generic_name', genericName);
        formData.append('strength', strength);
        formData.append('trade_price', tradePrice);
        formData.append('box_size', boxSize);
        formData.append('expire_date', expDate);
        formData.append('side_effect', sideEffect);
        formData.append('product_name', productName);
        formData.append('barcode', barcodeNum);
        formData.append('mrp', mrp);
        formData.append('box_price', boxPrices);
        formData.append('instock', quantity);
        formData.append('short_stock', ShortQty);
        formData.append('form', form);
        formData.append('discount', discountType);
        formData.append('image', selectedImage);

        const response = await postMedicineData(formData);

        if (!barcodeNum) {
          throw new Error('Barcode number is empty');
        }

        formData.append('barcode', barcodeNum); // Ensure barcodeNum is included
        if (response?.status === 200) {
          setSuccessMessage('Medicine added successfully.');
          setFailureMessage('');
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Medicine added successfully.'
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
        console.error('Error appending barcode number to form data:', error);
        setFailureMessage('Error adding medicine. Please try again.');
        console.error('Error adding medicine:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error adding medicine. Please try again.'
        });
      }
  };

    const validateForm = () => {
      const errors = {};

      if (companyName.trim() === '') {
        errors.companyName = 'Supplier is required';
      }

      if (genericName.trim() === '') {
        errors.genericName = 'Generic name is required';
      }

      if (strength.trim() === '') {
        errors.strength = 'Strength is required';
      }

      if (tradePrice.trim() === '') {
        errors.tradePrice = 'tradePrice is required';
      }

      if (boxSize.trim() === '') {
        errors.boxSize = 'boxSize is required';
      }

      if (expDate.trim() === '') {
        errors.expDate = 'expDate is required';
      }

      if (productName.trim() === '') {
        errors.productName = 'productName is required';
      }

      if (mrp.trim() === '') {
        errors.mrp = 'mrp is required';
      }

      if (quantity.trim() === '') {
        errors.quantity = 'quantity is required';
      }

      if (ShortQty.trim() === '') {
        errors.ShortQty = 'ShortQty is required';
      }

      if (form.trim() === '') {
        errors.form = 'form is required';
      }

      if (!selectedImage) {
        errors.selectedImage = 'Image is required';
        console.log("11");
      }

      setErrors(errors);

      return Object.keys(errors).length === 0;
    }
    // navigation
    const navigate = useNavigate();
    const handleButtonClick = () => {
      navigate('/medicine/manage-medicine');
    };
    const handleButtonClick1 = () => {
      // navigate('/medicine/manage-medicine');
    };
    const handleButtonClick2 = () => {
      navigate('/medicine/add-medicine');
    };

    //for age
    const [formValue, setFormValue] = useState('');

    const handleChange = (event) => {
      setFormValue(event.target.value); // Update formValue state
      setForm(event.target.value); // Update form state
    };
    // number input field====================>
    //Trade Price
    const handleTradePrice = (e) => {
      const input = e.target.value;
      const numericInput = input.replace(/\D/g, '');
      setTradePrice(numericInput);
    };
    //Box Size
    const handleBoxSize = (e) => {
      const input = e.target.value;
      const numericInput = input.replace(/\D/g, '');
      setBoxSize(numericInput);
    };
    //Barcode number
    const handleBarcode = () => {
      const randomBarcode = Math.floor(10000000000 + Math.random() * 90000000000);
      setBarcodeNum(randomBarcode.toString().substring(0, 11));
    };
    //MRP
    const handleMrp = (e) => {
      const input = e.target.value;
      const numericInput = input.replace(/\D/g, '');
      setMrp(numericInput);
    };
    //Box price
    const handleBoxPrice = (e) => {
      const input = e.target.value;
      const numericInput = input.replace(/\D/g, '');
      setBoxPrices(numericInput);
    };
    //Short Qty
    const handleShortQty = (e) => {
      const input = e.target.value;
      const numericInput = input.replace(/\D/g, '');
      setShortQty(numericInput);
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      displayImage(file);
    };
    //display image
    const displayImage = (file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    };
    //checkbox
    const [isChecked, setIsChecked] = useState(false);

    const handleChangeCB = () => {
      setIsChecked(true);
    };

    const handleToggle = () => {
      setSelectedOption((prevOption) => (prevOption === 'Yes' ? 'No' : 'Yes'));
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedImage(file);
      }
    };
    //==========barcode generator==========
    //barcode generator
    const { inputRef } = useBarcode({
      value: `${barcodeNum}` || ' ',
      options: {
        background: '#f9f9f9'
      }
    });

    useEffect(() => {
      handleBarcode(); // Generate barcode number on component mount
    }, []);

    if (error) {
      return <InternalServerError onRetry={handleRetry} />; // Show error page if error occurred
    }

    return (
      <div style={{ margin: '10px' }}>
        <Stack direction='row' spacing={2} style={{ marginBottom: '15px' }}>
          <Button
            onClick={handleButtonClick}
            variant='contained'
            startIcon={<MenuIcon />}
            style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
          >
            Manage Medicine
          </Button>
        </Stack>

        <Card style={{ backgroundColor: '#ffffff' }}>
          <CardContent>
            <div className='bg-light'>
              <Grid container spacing={2}>
                <Grid item xs={6} md={10} lg={10}>
                  <h3 className='text-primary'>New Medicine</h3>
                </Grid>
                <Grid item xs={6} md={2} lg={2}>
                  Wednesday 7th of February 2024 04:37:08 PM
                </Grid>
              </Grid>
              <hr />
              <div style={{ marginBottom: '20px' }}>
                <Grid container spacing={2}>
                  {/* First Column */}
                  <Grid item xs={12} md={6}>
                    <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete='off'>
                      <Grid item>
                        <FormControl size='small' fullWidth multiline>
                          <InputLabel id='companyName-label'>Company Name</InputLabel>
                          <Select
                            id='companyName'
                            value={selectedSupplier}
                            onChange={handleSupplierChange}
                            label='Company Name'
                            placeholder='supplier Name'
                            required
                            error={!!errors.companyName}
                            helperText={errors.companyName}
                          >
                            {supplierList.map((supplier) => (
                              <MenuItem key={supplier.supplier_id} value={supplier.supplier_id}>
                                {supplier.supplier_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <TextField
                        size='small'
                        id='generic_name'
                        required
                        onChange={(e) => setGenericName(e.target.value)}
                        label='Generic Name'
                        placeholder='Generic Name'
                        multiline
                        error={!!errors.genericName}
                        helperText={errors.genericName}
                      />
                      <TextField
                        size='small'
                        id='strength'
                        required
                        onChange={(e) => setStrength(e.target.value)}
                        label='Strength'
                        placeholder='Strength'
                        multiline
                        error={!!errors.strength}
                        helperText={errors.strength}
                      />
                      <TextField
                        size='small'
                        label='Trade Price'
                        id='trade_price'
                        placeholder='Trade Price'
                        multiline
                        required
                        value={tradePrice}
                        onChange={handleTradePrice}
                        fullWidth
                        error={!!errors.tradePrice}
                        helperText={errors.tradePrice}
                      />
                      <TextField
                        size='small'
                        label='Box Size'
                        id='boxSize'
                        placeholder='Box Size'
                        multiline
                        required
                        value={boxSize}
                        onChange={handleBoxSize}
                        fullWidth
                        error={!!errors.boxSize}
                        helperText={errors.boxSize}
                      />
                      <TextField
                        size='small'
                        required
                        id='expiry-date'
                        label='Expiry Date'
                        type='date'
                        onChange={(e) => setExpDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.expDate}
                        helperText={errors.expDate}
                      />
                      <TextField
                        size='small'
                        id='outlined-textarea'
                        label='Side Effect'
                        placeholder='Side Effect'
                        onChange={(e) => setSideEffect(e.target.value)}
                        multiline
                      />
                    </Box>
                  </Grid>

                  {/* Second Column */}
                  <Grid item xs={12} md={6}>
                    <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate Validate autoComplete='off'>
                      <TextField
                        required
                        size='small'
                        id='outlined-textarea'
                        label='Product Name'
                        placeholder='Product Name'
                        multiline
                        onChange={(e) => setProductName(e.target.value)}
                        error={!!errors.productName}
                        helperText={errors.productName}
                      />
                      <TextField
                        size='small'
                        id='barcodeNum'
                        multiline
                        required
                        value={barcodeNum}
                        onChange={handleBarcode}
                        fullWidth
                        label='Barcode Number'
                        placeholder='Enter Barcode Number'
                      />
                      <img ref={inputRef} alt='barcode' style={{ display: 'none' }} />
                      <TextField
                        size='small'
                        label='M.R.P.'
                        id='mrp'
                        multiline
                        required
                        value={mrp}
                        onChange={handleMrp}
                        fullWidth
                        placeholder='M.R.P.'
                        error={!!errors.mrp}
                        helperText={errors.mrp}
                      />
                      <TextField
                        label='Box Pirce'
                        multiline
                        required
                        value={boxPrices}
                        size='small'
                        id='boxPrices'
                        onChange={handleBoxPrice}
                        fullWidth
                        placeholder='Box Pirce'
                      />
                      <TextField
                        size='small'
                        label='Quantity'
                        id='inStockQuantity'
                        multiline
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        fullWidth
                        placeholder='Quantity'
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                      />
                      <TextField
                        size='small'
                        label='Short Quantity'
                        id='ShortQty'
                        multiline
                        required
                        value={ShortQty}
                        onChange={handleShortQty}
                        fullWidth
                        placeholder='Short Quantity'
                        error={!!errors.ShortQty}
                        helperText={errors.ShortQty}
                      />
                      <Grid item>
                        <FormControl size='small' fullWidth>
                          <InputLabel id='demo-simple-select-label'>Form</InputLabel>
                          <Select
                            required
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={formValue}
                            onChange={handleChange} // Update onChange event to handleChange
                            label='formValue'
                            error={!!errors.form}
                            helperText={errors.form}
                          >
                            <MenuItem value={'tablet'}>Tablet</MenuItem>
                            <MenuItem value={'capsule'}>Capsule</MenuItem>
                            <MenuItem value={'injection'}>Injection</MenuItem>
                            <MenuItem value={'eyeDrop'}>Eye Drop</MenuItem>
                            <MenuItem value={'suspension'}>Suspension</MenuItem>
                            <MenuItem value={'cream'}>Cream</MenuItem>
                            <MenuItem value={'saline'}>Saline</MenuItem>
                            <MenuItem value={'inhaler'}>Inhaler</MenuItem>
                            <MenuItem value={'power'}>Power</MenuItem>
                            <MenuItem value={'spray'}>Spray</MenuItem>
                            <MenuItem value={'paediatricDrop'}>Paediatric Drop</MenuItem>
                            <MenuItem value={'nebuliserSolution'}>Nebuliser Solution</MenuItem>
                            <MenuItem value={'powerForSuspension'}>Power for Suspension</MenuItem>
                            <MenuItem value={'nasalDrop'}>Nasal Drops</MenuItem>
                            <MenuItem value={'eyeOintment'}>Eye Ointment</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <div
                        style={{
                          marginTop: '7px',
                          display: 'flex',
                          alignItems: 'center',
                          marginLeft: '10px',
                          border: '1px solid #ccc',
                          width: '100%',
                          padding: '10px',
                          borderRadius: '10px'
                        }}
                      >
                        <input type='file' onChange={handleImageChange} required accept='image/*' style={{ width: '100%' }} />
                        {errors.selectedImage && <div style={{ color: 'red' }}>{errors.selectedImage}</div>}
                        {selectedImage && (
                          <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <img src={URL.createObjectURL(selectedImage)} alt='Selected' style={{ maxWidth: '100%', maxHeight: '30px' }} />
                          </div>
                        )}
                      </div>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {/* First Column */}
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      className=''
                      control={
                        <Checkbox
                          icon={<span style={{ width: '16px', height: '16px', border: '2px solid #000', borderRadius: '3px' }} />}
                          checkedIcon={
                            <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              ✓
                            </span>
                          }
                          checked={isChecked}
                          onChange={handleChangeCB}
                          disabled={isChecked}
                          name='addToFavourite'
                        />
                      }
                      label='Add to Favourite'
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl component='fieldset'>
                      <RadioGroup
                        row
                        aria-label='discount-type'
                        name='discount-type'
                        value={selectedOption}
                        required
                        onChange={(e) => setDiscountType(e.target.value)}
                      >
                        <h4 style={{ margin: '10px', marginTop: '12px' }}>Discount</h4>
                        <FormControlLabel
                          onClick={() => setSelectedOption('Yes')}
                          variant={selectedOption === 'Yes' ? 'contained' : 'outlined'}
                          value='Yes'
                          control={<Radio />}
                          label='Yes'
                        />
                        <FormControlLabel
                          onClick={() => setSelectedOption('No')}
                          variant={selectedOption === 'No' ? 'contained' : 'outlined'}
                          value='No'
                          control={<Radio />}
                          label='No'
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
              {/* <hr /> */}
              {successMessage && (
                <Alert severity='success'>
                  <AlertTitle>Success</AlertTitle>
                  {successMessage}
                </Alert>
              )}
              {failureMessage && (
                <Alert severity='error'>
                  <AlertTitle>Error</AlertTitle>
                  {failureMessage}
                </Alert>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Stack spacing={2} direction='row'>
                  <Button onClick={handleSubmit} variant='contained'>
                    Submit
                  </Button>
                  <Button onClick={handleButtonClick2} variant='outlined'>
                    Cancel
                  </Button>
                </Stack>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default AddMedicine;
