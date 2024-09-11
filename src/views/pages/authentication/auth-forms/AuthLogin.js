import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Added useDispatch
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Google from 'assets/images/icons/social-google.svg';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import useAuth from './useAuth';
import { loginSuccess } from './actions'; // Adjust the path as necessary
import { handlelogin } from 'utils/api';

const FirebaseLogin = ({ ...others }) => {
  useAuth(); // Check authentication status when accessing the login page

  const dispatch = useDispatch(); // Added useDispatch
  const navigate = useNavigate();
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [checked, setChecked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSelectCounter, setShowSelectCounter] = useState(false); // State to manage the visibility of the select field
  const [selectedCounter, setSelectedCounter] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
    try {
      console.log("on login - ", values);
      const response = await handlelogin(values)

      if (response.status === 200) {
        Cookies.set('user_login', response.data.token, { expires: 1 });
        const userData = JSON.stringify(response.data);
        localStorage.setItem('user_data', userData);
        dispatch(loginSuccess(response.data)); // Dispatch loginSuccess with user data
        Swal.fire({
          title: 'Login Successfully!',
          icon: 'success',
        });
        setTimeout(() => {
          window.location.replace('/dashboard/default');
          // navigate('/dashboard/default');
        }, 1000);
      }
    } catch (error) {
      setErrors({ submit: error.message });
      Swal.fire({
        title: 'Error!',
        text: 'Invalid email or password',
        icon: 'error',
      });
    } finally {
      if (scriptedRef.current) {
        setStatus({ success: true });
        setSubmitting(false);
      }
    }
  };

  const handleSelectCounterChange = (event) => {
    setSelectedCounter(event.target.value);
  };

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
        })}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                }}
                label="Email Address / Username"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
              <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            {/* Select field for counters */}
            {showSelectCounter && (
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel htmlFor="counter-select">Select Counter</InputLabel>
                <Select
                  id="counter-select"
                  value={selectedCounter}
                  onChange={handleSelectCounterChange}
                  label="Select Counter"
                >
                  <MenuItem value="Counter 1">Counter 1</MenuItem>
                  <MenuItem value="Counter 2">Counter 2</MenuItem>
                  <MenuItem value="Counter 3">Counter 3</MenuItem>
                  <MenuItem value="Counter 4">Counter 4</MenuItem>
                  <MenuItem value="Counter 5">Counter 5</MenuItem>
                </Select>
              </FormControl>
            )}
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <FormControlLabel
                control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
                label="Remember me"
              />
              <Typography variant="subtitle1" color="secondary" sx={{ textDecoration: 'none', cursor: 'pointer' }}>
                Forgot Password?
              </Typography>
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Sign in
                </Button>
              </AnimateButton>
            </Box>

            {/* Button to toggle the select field */}
            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  fullWidth
                  size="large"
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowSelectCounter(!showSelectCounter)}
                >
                  Select Counter
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
