import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const Setting = () => {
  const [successAlert, setSuccessAlert] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  //   const [copyright, setCopyright] = useState('');
  const [siteTitle, setSiteTitle] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  //   const [currency, setCurrency] = useState('');
  //   const [symbol, setSymbol] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', companyName);
    formData.append('sitetitle', siteTitle);
    formData.append('description', description);
    // formData.append('copyright', copyright);
    formData.append('contact', phoneNumber);
    // formData.append('symbol', symbol);
    // formData.append('currency', currency);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('image', selectedImage);

    axios
      .post(`http://localhost:8080/setting`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        if (response.status === 201) {
          setSuccessAlert(true);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // number input field
  const handlePhoneNum = (e) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, '');
    setPhoneNumber(numericInput);
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

  return (
    <div style={{ margin: '10px' }}>
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardContent>
          <div className='bg-light'>
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>General Settings</h3>
              </Grid>
            </Grid>
            <hr />
            <div>
              <Grid container spacing={2}>
                {/* First Column */}

                <Grid item xs={12} md={6}>
                  <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} autoComplete='off'>
                    <TextField
                      id='companyName'
                      label='Company Name'
                      placeholder='Company Name'
                      multiline
                      size='small'
                      required
                      onChange={(e) => setCompanyName(e.target.value)}
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
                    <TextField
                      id='address'
                      label='Address'
                      placeholder='Address'
                      multiline
                      size='small'
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </Box>
                </Grid>

                {/* Second Column */}
                <Grid item xs={12} md={6}>
                  <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} autoComplete='off'>
                    <TextField
                      id='title'
                      label='Company Title'
                      placeholder='Company Title'
                      multiline
                      size='small'
                      onChange={(e) => setSiteTitle(e.target.value)}
                      required
                    />
                    <TextField
                      label='Phone Number'
                      type='number'
                      value={phoneNumber}
                      size='small'
                      id='s_phone'
                      onChange={handlePhoneNum}
                      fullWidth
                    />
                    <TextField
                      id='email'
                      label='Email'
                      placeholder='Email'
                      multiline
                      size='small'
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box component='form' sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }} autoComplete='off'>
                    <TextField
                      id='description'
                      label='Describe about your Company'
                      multiline
                      rows={4}
                      size='small'
                      required
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
              <Stack spacing={2} direction='row'>
                <Button onClick={handleSubmit} variant='contained'>
                  Submit
                </Button>
                <Button variant='outlined'>Cancel</Button>
              </Stack>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setting;
