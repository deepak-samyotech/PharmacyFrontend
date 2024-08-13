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
import Switch from '@mui/material/Switch';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Payments = () => {
  const [transaction, setTransaction] = useState('');
  const [bankName, setBankName] = useState('');
  const [date, setDate] = useState('');
  const [cPOrder, setCPOrder] = useState('');
  const [payAmt, setPayAmt] = useState('');
  const [selectedOption, setSelectedOption] = useState('payment');

  const handleChange = (event) => {
    setTransaction(event.target.value);
  };

  const handleBankNameChange = (event) => {
    setBankName(event.target.value);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleCPOrderChange = (event) => {
    setCPOrder(event.target.value);
  };

  // number input field
  const handleNumberChange1 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setPayAmt(inputValue);
  };
  const [recAmt, setRecAmt] = useState('');
  const handleNumberChange2 = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setRecAmt(inputValue);
  };

  // const [isPayment, setIsPayment] = useState(true);

  // const handleSwitchChange = () => {
  //     setIsPayment((prevIsPayment) => !prevIsPayment);
  // };

  // const getData = () => {
  //     // Replace this with your actual data fetching logic for payment and receipt
  //     return isPayment
  //         ? {
  //             title: 'Payment Data',
  //             content: 'This is payment data...',
  //         }
  //         : {
  //             title: 'Receipt Data',
  //             content: 'This is receipt data...',
  //         };
  // };
  // const { title, content } = getData();

  const handleToggle = () => {
    setSelectedOption((prevOption) =>
      prevOption === 'payment' ? 'receipt' : 'payment'
    );
  };

  return (
    <div>
      <div style={{ marginLeft: '10px' }}>
        <Grid container spacing={2}>
          <Grid xs={6} md={10} lg={10}>
            <Typography>
              <h5>Choose Transection</h5>
            </Typography>
            <Button
              variant={selectedOption === 'payment' ? 'contained' : 'outlined'}
              color='primary'
              startIcon={<PaymentIcon />}
              onClick={() => setSelectedOption('payment')}
              style={{ margin: '5px' }}
            >
              Payment
            </Button>
            <Button
              variant={selectedOption === 'receipt' ? 'contained' : 'outlined'}
              color='primary'
              startIcon={<ReceiptIcon />}
              onClick={() => setSelectedOption('receipt')}
              style={{ margin: '5px' }}
            >
              Receipt
            </Button>
          </Grid>
        </Grid>
      </div>
      <div>
        {selectedOption === 'payment' && (
          // Display Payment data here
          <div>
            <div style={{ margin: '10px' }}>
              <Card style={{ backgroundColor: '#ffffff' }}>
                <CardContent>
                  <div className='bg-light'>
                    <Grid container spacing={2}>
                      <Grid xs={6} md={10} lg={10}>
                        <h3>Payment</h3>
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
                          <Box
                            component='form'
                            sx={{
                              '& .MuiTextField-root': { m: 1, width: '100%' },
                            }}
                            noValidate
                            autoComplete='off'
                          >
                            <TextField size='small'
                              id='outlined-textarea'
                              label='Transection Name'
                              placeholder='Transection Name'
                              multiline
                            />
                            <Grid item>
                              <FormControl fullWidth>
                                <InputLabel id='demo-simple-select-label' size='small'>
                                  Transection Mood
                                </InputLabel>
                                <Select
                                  labelId='demo-simple-select-label'
                                  id='demo-simple-select'
                                  value={transaction}
                                  label='Transection Mood'
                                  size='small'
                                  onChange={handleChange}
                                >
                                  <MenuItem value={'tablet'}>Bank</MenuItem>
                                  <MenuItem value={'capsule'}>Cash</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            {transaction === 'tablet' && (
                              <>
                                <TextField size='small'
                                  id='outlined-basic'
                                  label='Bank Name'
                                  value={bankName}
                                  onChange={handleBankNameChange}
                                  fullWidth
                                />
                                <TextField size='small'
                                  id='outlined-basic'
                                  label='Date'
                                  value={date}
                                  onChange={handleDateChange}
                                  type='date'
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </>
                            )}
                          </Box>
                        </Grid>

                        {/* Second Column */}
                        <Grid item xs={12} md={6}>
                          <Box
                            component='form'
                            sx={{
                              '& .MuiTextField-root': { m: 1, width: '100%' },
                            }}
                            noValidate
                            autoComplete='off'
                          >
                            <TextField size='small'
                              id='outlined-textarea'
                              label='Descrition'
                              placeholder='Details'
                              multiline
                            />
                            <TextField size='small'
                              label='Payment Amount'
                              type='number'
                              value={payAmt}
                              onChange={handleNumberChange1}
                              fullWidth
                            />
                               {transaction === 'tablet' && (
                              <>
                                <TextField size='small'
                                  id='outlined-basic'
                                  label='Check/Pay Order No*'
                                  value={cPOrder}
                                  onChange={handleCPOrderChange}
                                  fullWidth
                                />
                              </>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                    </div>
                    <hr />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Stack spacing={2} direction='row'>
                        <Button variant='contained'>Submit</Button>
                        <Button variant='outlined'>Cancel</Button>
                      </Stack>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {selectedOption === 'receipt' && (
          // Display Receipt data here
          <div style={{ margin: '10px' }}>
            <Card style={{ backgroundColor: '#ffffff' }}>
              <CardContent>
                <div className='bg-light'>
                  <Grid container spacing={2}>
                    <Grid xs={6} md={10} lg={10}>
                      <h3>Receipt</h3>
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
                      <Box
                            component='form'
                            sx={{
                              '& .MuiTextField-root': { m: 1, width: '100%' },
                            }}
                            noValidate
                            autoComplete='off'
                          >
                            <TextField size='small'
                              id='outlined-textarea'
                              label='Transection Name'
                              placeholder='Transection Name'
                              multiline
                            />
                            <Grid item>
                              <FormControl fullWidth>
                                <InputLabel id='demo-simple-select-label' size='small'>
                                  Transection Mood
                                </InputLabel>
                                <Select
                                  labelId='demo-simple-select-label'
                                  id='demo-simple-select'
                                  value={transaction}
                                  label='Transection Mood'
                                  size='small'
                                  onChange={handleChange}
                                >
                                  <MenuItem value={'tablet'}>Bank</MenuItem>
                                  <MenuItem value={'capsule'}>Cash</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            {transaction === 'tablet' && (
                              <>
                                <TextField size='small'
                                  id='outlined-basic'
                                  label='Bank Name'
                                  value={bankName}
                                  onChange={handleBankNameChange}
                                  fullWidth
                                />
                                <TextField size='small'
                                  id='outlined-basic'
                                  label='Date'
                                  value={date}
                                  onChange={handleDateChange}
                                  type='date'
                                  fullWidth
                                  InputLabelProps={{ shrink: true }}
                                />
                              </>
                            )}
                          </Box>
                      </Grid>

                      {/* Second Column */}
                      <Grid item xs={12} md={6}>
                        <Box
                          component='form'
                          sx={{
                            '& .MuiTextField-root': { m: 1, width: '100%' },
                          }}
                          noValidate
                          autoComplete='off'
                        >
                          <TextField size='small'
                            id='outlined-textarea'
                            label='Descrition'
                            placeholder='Details'
                            multiline
                          />
                          <TextField size='small'
                            label='Receipt Amount'
                            type='number'
                            value={recAmt}
                            onChange={handleNumberChange2}
                            fullWidth
                          />
                           {transaction === 'tablet' && (
                              <>
                                <TextField size='small'
                                  id='outlined-basic'
                                  label='Check/Pay Order No*'
                                  value={cPOrder}
                                  onChange={handleCPOrderChange}
                                  fullWidth
                                />
                              </>
                            )}
                        </Box>
                      </Grid>
                    </Grid>
                  </div>
                  <hr />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Stack spacing={2} direction='row'>
                      <Button variant='contained'>Submit</Button>
                      <Button variant='outlined'>Cancel</Button>
                    </Stack>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    //   =================================================================================================================================
    // <div style={{ padding: 20 }}>
    //     <FormControlLabel
    //         control={<Switch checked={isPayment} onChange={handleSwitchChange} />}
    //         label={isPayment ? 'Payment' : 'Receipt'}
    //     />

    //     <Paper style={{ padding: 20, marginTop: 20 }}>
    //         <Typography variant='h6'>{title}</Typography>
    //         <Typography>{content}</Typography>
    //     </Paper>
    // </div>
    // ================================================================================================================================
  );
};

export default Payments;
