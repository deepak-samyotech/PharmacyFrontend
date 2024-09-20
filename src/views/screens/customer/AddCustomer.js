import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { display } from '@mui/system';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import moment from 'moment';
import { postCustomerData } from 'utils/api';
import { toast } from 'react-toastify';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const AddCustomer = () => {
  const [customerType, setCustomerType] = useState('Regular');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [targetAmount, setTargetAmount] = useState('');
  const [regularDiscount, setRegularDiscount] = useState('');
  const [targetDiscount, setTargetDiscount] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      console.log(validateForm());

      if (validateForm()) {
        const formData = new FormData();

        console.log("In if wholesale submit");
        console.log("formadata = ", formData);

        formData.append('c_name', customerName);
        formData.append('cus_contact', customerContact);
        formData.append('c_email', customerEmail);
        formData.append('c_address', customerAddress);
        formData.append('c_type', customerType);
        formData.append('target_amount', targetAmount);
        formData.append('regular_discount', regularDiscount);
        formData.append('target_discount', targetDiscount);
        formData.append('pharmacy_name', pharmacyName);
        formData.append('c_note', note);
        formData.append('image', selectedImage);

        const response = await postCustomerData(formData);

        if (response?.status === 200) {
          toast.success("Customer Add Successfully !")
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error while adding Customer");
    }
  };

  const validateForm = () => {

    console.log("customerType : ", customerType);

    const errors = {};
    if (customerName.trim() === '') {
      errors.customerName = 'Customer name is required';
      console.log("1");
    }
    if (!customerContact.trim().match(/^\d{10}$/)) {
      errors.customerContact = 'Invalid contact number';
      console.log("2");

    }
    if (customerEmail.trim() === '') {
      errors.customerEmail = 'Email is required';
      console.log("3");

    } else if (!isValidEmail(customerEmail)) {
      errors.customerEmail = 'Invalid email address';
      console.log("4");
    }
    if (customerAddress.trim() === '') {
      errors.customerAddress = 'Address is required';
      console.log("5");

    }
    if (note.trim() === '') {
      errors.note = 'Write some note..';
      console.log("6");

    }
    if (customerType === 'Regular') {
      if (targetAmount.trim() === '') {
        errors.targetAmount = 'Target amount is required';
        console.log("7");

      }
      if (regularDiscount.trim() === '') {
        errors.regularDiscount = 'Regular discount is required';
        console.log("8");

      }
      if (targetDiscount.trim() === '') {
        errors.targetDiscount = 'Target discount is required';
        console.log("9");

      }
    } else {
      if (pharmacyName.trim() === '') {
        errors.pharmacyName = 'Pharmacy name is required';
        console.log("10");

      }
    }
    if (!selectedImage) {
      errors.selectedImage = 'Image is required';
      console.log("11");

    }
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  console.log("1");


  const isValidEmail = (email) => {
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
    console.log("1");
    return emailRegex.test(email);


  };

  // number input field====================>
  //phone number
  const handleNumberChange = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, '');
    setCustomerContact(numericInput);
  };
  //target amount
  const handleTargetAmount = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, '');
    setTargetAmount(numericInput);
  };
  // Regular Discount
  const handleRegularDiscount = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, '');
    setRegularDiscount(numericInput);
  };
  //target Discount
  const handleTargetDiscount = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, '');
    setTargetDiscount(numericInput);
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleChangeCB = () => {
    setIsChecked(true);
  };

  // navigation
  const navigate = useNavigate();
  const handleButtonClick1 = () => {
    navigate('/customer/manage-customer');
  };
  const handleButtonClick2 = () => {
    navigate('/customer/regular-customer');
  };
  const handleButtonClick3 = () => {
    navigate('/customer/wholesale-customer');
  };

  const handleButtonClick4 = () => {
    navigate('/customer/add-customer');
  };

  const [selectedOption, setSelectedOption] = useState('Regular');

  const handleToggle = () => {
    setSelectedOption((prevOption) => (prevOption === 'Regular' ? 'Wholesale' : 'Regular'));
  };


  // Get the current date and time
  const currentDate = moment();

  // Format the date according to the desired format
  const formattedDate = currentDate.format('dddd Do [of] MMMM YYYY hh:mm:ss A');

  return (
    <div style={{ margin: '10px' }}>
      <Stack direction='row' spacing={2} style={{ marginBottom: '15px' }}>
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
        <Button
          onClick={handleButtonClick3}
          variant='contained'
          startIcon={<MenuIcon />}
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
        >
          Wholesale Customer
        </Button>
      </Stack>
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardContent>
          <div className='bg-light'>
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>New Customer</h3>
              </Grid>
              <Grid xs={6} md={2} lg={2}>
                {formattedDate}
              </Grid>
            </Grid>
            <hr />
            <div>
              <Grid container spacing={2}>
                {/* First Column */}
                <Grid item xs={12} md={6}>
                  <FormControl component='fieldset'>
                    {/* <RadioGroup
                      row
                      aria-label='customer-type'
                      name='customer-type'
                      value={selectedOption}
                      onChange={(e) => {
                        console.log("in change");
                        setCustomerType(e.target.value);
                        console.log(e.target.value);
                      }}
                    >
                      <FormControlLabel
                        onClick={() => setSelectedOption('Regular')}
                        variant={selectedOption === 'Regular' ? 'contained' : 'outlined'}
                        value='Regular'
                        control={<Radio />}
                        label='Regular Customer'
                      />
                      <FormControlLabel
                        onClick={() => setSelectedOption('Wholesale')}
                        variant={selectedOption === 'Wholesale' ? 'contained' : 'outlined'}
                        value='Wholesale'
                        control={<Radio />}
                        label='Wholesale Customer'
                      />
                    </RadioGroup> */}

                    {/* //By deepak */}
                    <RadioGroup
                      row
                      aria-label='customer-type'
                      name='customer-type'
                      value={selectedOption}
                      onChange={(e) => {
                        console.log("in change");
                        setSelectedOption(e.target.value);
                        setCustomerType(e.target.value);
                        console.log(e.target.value); // This will log the selected value immediately
                      }}
                    >
                      <FormControlLabel
                        value='Regular'
                        control={<Radio />}
                        label='Regular Customer'
                      />
                      <FormControlLabel
                        value='Wholesale'
                        control={<Radio />}
                        label='Wholesale Customer'
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              {selectedOption === 'Regular' && (
                <Grid container spacing={2}>
                  {/* First Column */}

                  <Grid item xs={12} md={6}>
                    <Box
                      component='form'
                      sx={{ '& .MuiTextField-root': { ml: 1, mt: 2, mr: 1, width: '100%' } }}
                      noValidate
                      autoComplete='off'
                    >
                      <TextField
                        id='c_name'
                        required
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder='Customer Name'
                        label='Customer Name'
                        multiline
                        size='small'
                        error={!!errors.customerName}
                        helperText={errors.customerName}
                      />

                      <TextField
                        id='cus_contact'
                        label='Phone Number'
                        placeholder='Phone Number'
                        multiline
                        required
                        value={customerContact}
                        onChange={(e) => setCustomerContact(e.target.value)}
                        size='small'
                        error={!!errors.customerContact}
                        helperText={errors.customerContact}
                      />
                      <TextField
                        id='c_email'
                        label='Email'
                        placeholder='Email'
                        multiline
                        required
                        size='small'
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        error={!!errors.customerEmail}
                        helperText={errors.customerEmail}
                      />

                      <TextField
                        id='c_address'
                        label='Address'
                        placeholder='Address'
                        multiline
                        required
                        size='small'
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        error={!!errors.customerAddress}
                        helperText={errors.customerAddress}
                      />
                      <TextField
                        id='note'
                        label='Note'
                        placeholder='Note'
                        multiline
                        required
                        size='small'
                        onChange={(e) => setNote(e.target.value)}
                        error={!!errors.note}
                        helperText={errors.note}
                      />
                    </Box>
                  </Grid>

                  {/* Second Column */}
                  <Grid item xs={12} md={6}>
                    <Box
                      component='form'
                      sx={{ '& .MuiTextField-root': { mt: 2, ml: 1, mr: 1, width: '100%' } }}
                      noValidate
                      autoComplete='off'
                    >
                      <TextField
                        id='targetAmount'
                        label='Target Amount'
                        placeholder='Target Amount'
                        multiline
                        required
                        value={targetAmount}
                        onChange={handleTargetAmount}
                        size='small'
                        error={!!errors.targetAmount}
                        helperText={errors.targetAmount}
                      />
                      <TextField
                        id='regularDiscount'
                        label='Regular Discount'
                        placeholder='Regular Discount'
                        multiline
                        required
                        size='small'
                        value={regularDiscount}
                        onChange={handleRegularDiscount}
                        error={!!errors.regularDiscount}
                        helperText={errors.regularDiscount}
                      />
                      <TextField
                        id='targetDiscount'
                        label='Target Discount'
                        placeholder='Target Discount'
                        multiline
                        required
                        size='small'
                        value={targetDiscount}
                        onChange={handleTargetDiscount}
                        error={!!errors.targetDiscount}
                        helperText={errors.targetDiscount}
                      />

                      <div
                        style={{
                          marginTop: '15px',
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
              )}
              {selectedOption === 'Wholesale' && (
                <Grid container spacing={2}>
                  {/* First Column */}

                  <Grid item xs={12} md={6}>
                    <Box
                      component='form'
                      sx={{ '& .MuiTextField-root': { ml: 1, mt: 2, mr: 1, width: '100%' } }}
                      noValidate
                      autoComplete='off'
                    >
                      <TextField
                        id='c_name'
                        required
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder='Customer Name'
                        label='Customer Name'
                        multiline
                        size='small'
                        error={!!errors.customerName}
                        helperText={errors.customerName}
                      />

                      <TextField
                        id='cus_contact'
                        label='Phone Number'
                        placeholder='Phone Number'
                        multiline
                        required
                        value={customerContact}
                        onChange={(e) => setCustomerContact(e.target.value)}
                        size='small'
                        error={!!errors.customerContact}
                        helperText={errors.customerContact}
                      />

                      <TextField
                        id='c_email'
                        label='Email'
                        placeholder='Email'
                        multiline
                        required
                        size='small'
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        error={!!errors.customerEmail}
                        helperText={errors.customerEmail}
                      />

                      <TextField
                        id='c_address'
                        label='Address'
                        placeholder='Address'
                        multiline
                        required
                        size='small'
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        error={!!errors.customerAddress}
                        helperText={errors.customerAddress}
                      />
                    </Box>
                  </Grid>

                  {/* Second Column */}
                  <Grid item xs={12} md={6}>
                    <Box
                      component='form'
                      sx={{ '& .MuiTextField-root': { mt: 2, ml: 1, mr: 1, width: '100%' } }}
                      noValidate
                      autoComplete='off'
                    >
                      <TextField
                        id='pharmacyName'
                        label='Pharmacy Name'
                        placeholder='Pharmacy Name'
                        multiline
                        required
                        size='small'
                        onChange={(e) => setPharmacyName(e.target.value)}
                        error={!!errors.pharmacyName}
                        helperText={errors.pharmacyName}
                      />
                      <TextField
                        id='note'
                        label='Note'
                        placeholder='Note'
                        multiline
                        required
                        size='small'
                        onChange={(e) => setNote(e.target.value)}
                        error={!!errors.note}
                        helperText={errors.note}
                      />
                      <div
                        style={{
                          marginTop: '15px',
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
                        {selectedImage && (
                          <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <img src={URL.createObjectURL(selectedImage)} alt='Selected' style={{ maxWidth: '100%', maxHeight: '30px' }} />
                          </div>
                        )}
                      </div>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </div>
            <div style={{ margin: '3px', marginTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Stack spacing={2} direction='row'>
                  <Button onClick={handleSubmit} variant='contained'>
                    Submit
                  </Button>
                  <Button variant='outlined'>Cancel</Button>
                </Stack>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCustomer;
