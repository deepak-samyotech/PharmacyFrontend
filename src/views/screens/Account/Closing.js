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
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { handleRetry, PostClosingData } from 'utils/api';
import InternalServerError from 'ui-component/InternalServerError';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Closing = () => {
  const [date, setDate] = useState('');

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, [])
  const [openBalance, setOpenBalance] = useState('');
  const [cashIn, setCashIn] = useState('');
  const [cashOut, setCashOut] = useState('');
  const [cashInHand, setCashInHand] = useState('');
  const [closeBalance, setCloseBalance] = useState(null);
  const [adjustment, setAdjustment] = useState('');
  const [error, setError] = useState(false);

  const [errors, setErrors] = useState({});

  const [isCalling, setIsCalling] = useState(false);

  function setAllValueEmpty() {
    setOpenBalance('');
    setCashIn('');
    setCashOut('');
    setCashInHand('');
    setCloseBalance('');
    setAdjustment('');
  }

  const handleSubmit = async (e) => {

    try {
      e.preventDefault();

      setIsCalling(true);

      const newErrors = {};
      if (!date) newErrors.date = 'Date is required';
      if (!openBalance) newErrors.openBalance = 'Opening Balance is required';
      if (!cashIn) newErrors.cashIn = 'Cash In is required';
      if (!cashOut) newErrors.cashOut = 'Cash Out is required';
      if (!cashInHand) newErrors.cashInHand = 'Cash In Hand is required';
      if (!closeBalance) newErrors.closeBalance = 'Closing Balance is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsCalling(false);
        return;
      }

      const formData = new FormData();

      formData.append('date', date);
      formData.append('opening_balance', openBalance);
      formData.append('cash_in', cashIn);
      formData.append('cash_out', cashOut);
      formData.append('cash_in_hand', cashInHand);
      formData.append('closing_balance', closeBalance);
      formData.append('adjustment', adjustment);

      const response = await PostClosingData(formData)

      if (response.status === 200) {
        // setSuccessAlert(true);
        setAllValueEmpty();
        toast.success("Data Saved Successfully");
      }
    } catch (error) {
      console.log("Error : ", error);
      setError(true);
    } finally {
      setIsCalling(false);
    }
  };

  // number input field
  const handleDate = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setDate(inputValue);
  };
  const handleOpenBalance = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setOpenBalance(inputValue);
  };
  const handleCashIn = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setCashIn(inputValue);
  };
  const handleCashOut = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setCashOut(inputValue);
  };
  const handleCashInHand = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setCashInHand(inputValue);
  };
  const handleCloseBalance = (event) => {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    setCloseBalance(inputValue);
  };


  // Get the current date and time
  const currentDate = moment();

  // Format the date according to the desired format
  const formattedDate = currentDate.format('dddd Do [of] MMMM YYYY hh:mm:ss A');

  if (error) {
    return <InternalServerError onRetry={handleRetry} />;
  }

  return (
    <div style={{ margin: '10px' }}>
      <Card style={{ backgroundColor: '#ffffff' }}>
        <CardContent>
          <div className='bg-light'>
            <Grid container spacing={2}>
              <Grid xs={6} md={10} lg={10}>
                <h3>Add Closing</h3>
              </Grid>
              <Grid xs={6} md={2} lg={2}>
                {formattedDate}
              </Grid>
            </Grid>
            <hr />
            <div>
              <Grid container spacing={2}>
                {/* First Column */}
                <Grid item>
                  <Box
                    component='form'
                    sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                    noValidate
                    autoComplete='off'
                  >
                    <TextField
                      label='Date'
                      type='date'
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      fullWidth
                      size='small'
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={!!errors.date}
                      helperText={errors.date}
                    />
                    <TextField
                      label='Opening Balance'
                      type='number'
                      value={openBalance}
                      placeholder='0.00'
                      onChange={handleOpenBalance}
                      fullWidth
                      size='small'
                      error={!!errors.openBalance}
                      helperText={errors.openBalance}
                    />
                    <TextField
                      label='Cash In'
                      type='number'
                      value={cashIn}
                      placeholder='0.00'
                      onChange={handleCashIn}
                      fullWidth
                      size='small'
                      error={!!errors.cashIn}
                      helperText={errors.cashIn}
                    />
                    <TextField
                      label='Cash Out'
                      type='number'
                      value={cashOut}
                      placeholder='0.00'
                      onChange={handleCashOut}
                      fullWidth
                      size='small'
                      error={!!errors.cashOut}
                      helperText={errors.cashOut}
                    />
                    <TextField
                      label='Cash In Hand'
                      type='number'
                      value={cashInHand}
                      placeholder='0.00'
                      onChange={handleCashInHand}
                      fullWidth
                      size='small'
                      error={!!errors.cashInHand}
                      helperText={errors.cashInHand}
                    />
                    <TextField
                      label='Closing Balance'
                      type='number'
                      value={closeBalance}
                      placeholder='0.00'
                      onChange={handleCloseBalance}
                      fullWidth
                      size='small'
                      error={!!errors.closeBalance}
                      helperText={errors.closeBalance}
                    />
                    <TextField
                      id='outlined-textarea'
                      label='Adjustment'
                      value={adjustment}
                      onChange={(e) => setAdjustment(e.target.value)}
                      placeholder='Adjustment'
                      multiline
                      size='small'
                    />
                  </Box>
                </Grid>
              </Grid>
            </div>
            {/* <hr /> */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '15px'
              }}
            >
              <Stack spacing={2} direction='row'>
                <Button
                  variant='contained'
                  onClick={handleSubmit}
                  disabled={isCalling}
                >
                  Submit</Button>
                <Button variant='outlined'>Cancel</Button>
              </Stack>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Closing;
