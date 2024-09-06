import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const AddSupplier = () => {
  const [successAlert, setSuccessAlert] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append('s_name', supplierName);
      formData.append('s_email', email);
      formData.append('s_note', note);
      formData.append('status', status);
      formData.append('s_phone', phoneNumber);
      formData.append('s_address', address);
      formData.append('image', selectedImage);

      axios
        .post(`http://localhost:8080/supplier`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              title: 'Supplier Add Successfully !',
              text: 'You clicked the button!',
              icon: 'success'
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          Swal.fire({
            title: 'Error !',
            text: 'You clicked the button!',
            icon: 'error'
          });
        });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (supplierName.trim() === '') {
      errors.supplierName = 'Supplier is required';
    }

    if (email.trim() === '') {
      errors.email = 'email is required';
    }

    if (note.trim() === '') {
      errors.note = 'note is required';
    }

    if (status.trim() === '') {
      errors.status = 'status is required';
    }

    if (phoneNumber.trim() === '') {
      errors.phoneNumber = 'phoneNumber is required';
    }

    if (address.trim() === '') {
      errors.address = 'address is required';
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  }

  //for age

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  // image uploading field
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // number input field====================>
  //phone number
  const handlephoneNum = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, '');
    setPhoneNumber(numericInput);
  };

  // navigation
  const navigate = useNavigate();
  const handleButtonClick1 = () => {
    navigate('/supplier/manage-supplier');
  };
  const handleButtonClick2 = () => {
    navigate('/account/supplier-balance');
  };

  const handleButtonClick3 = () => {
    navigate('/supplier/add-supplier');
  };
  return (
    <div style={{ margin: '10px' }}>
      <Stack direction='row' spacing={2} style={{ marginBottom: '15px' }}>
        <Button
          onClick={handleButtonClick1}
          variant='contained'
          startIcon={<MenuIcon />}
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
        >
          Manage Supplier
        </Button>
        <Button
          onClick={handleButtonClick2}
          variant='contained'
          startIcon={<MenuIcon />}
          style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}
        >
          Supplier Balance
        </Button>
      </Stack>
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardContent>
          <div className='bg-light'>
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>New Supplier</h3>
              </Grid>
              <Grid xs={6} md={2} lg={2}>
                Wednesday 7th of February 2024 04:37:08 PM
              </Grid>
            </Grid>
            <hr />
            <div>
              <Grid container spacing={2}>
                {/* First Column */}

                <Grid item xs={12} md={6}>
                  <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete='off'>
                    <TextField
                      id='s_name'
                      label='Supplier Name'
                      placeholder='Supplier Name'
                      multiline
                      size='small'
                      required
                      onChange={(e) => setSupplierName(e.target.value)}
                      error={!!errors.supplierName}
                      helperText={errors.supplierName}
                    />
                    <TextField
                      label='Phone Number'
                      type='number'
                      value={phoneNumber}
                      size='small'
                      id='s_phone'
                      onChange={handlephoneNum}
                      fullWidth
                      required
                      error={!!errors.phoneNumber}
                      helperText={errors.phoneNumber}
                    />
                    <TextField
                      id='s_email'
                      label='Email'
                      placeholder='Email'
                      multiline
                      size='small'
                      required
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                    />

                    <TextField
                      id='s_note'
                      label='Note'
                      placeholder='Note'
                      multiline
                      size='small'
                      required
                      onChange={(e) => setNote(e.target.value)}
                      error={!!errors.note}
                      helperText={errors.note}
                    />
                  </Box>
                </Grid>

                {/* Second Column */}
                <Grid item xs={12} md={6}>
                  <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} noValidate autoComplete='off'>
                    <TextField
                      id='s_address'
                      label='Address'
                      placeholder='Address'
                      multiline
                      size='small'
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      error={!!errors.address}
                      helperText={errors.address}
                    />

                    <div
                      style={{
                        marginTop: '8px',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '10px',
                        border: '1px solid #ccc',
                        width: '100%',
                        padding: '9px',
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
                    <Grid item>
                      <FormControl size='small' fullWidth>
                        <InputLabel id='status'>Status</InputLabel>
                        <Select
                          labelId='status'
                          id='status'
                          value={status}
                          label='Status'
                          onChange={handleChange}
                          required
                          error={!!errors.status}
                          helperText={errors.status}
                        >
                          <MenuItem value={'Active'}>Active</MenuItem>
                          <MenuItem value={'Inactive'}>Inactive</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </div>
            <hr />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Stack spacing={2} direction='row'>
                <Button onClick={handleSubmit} variant='contained'>
                  Submit
                </Button>
                <Button onClick={handleButtonClick3} variant='outlined'>
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

export default AddSupplier;
