import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, Box, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';

const ChangePasswordForm = ({ handleSubmit }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (type) => {
    if (type === 'current') setShowCurrentPassword(!showCurrentPassword);
    else if (type === 'new') setShowNewPassword(!showNewPassword);
    else if (type === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        email: '', // Added email field for user identification
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        currentPassword: Yup.string().max(255).required('Current Password is required'),
        newPassword: Yup.string().max(255).required('New Password is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Confirm Password is required'),
      })}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <FormControl
            fullWidth
            error={Boolean(touched.email && errors.email)}
            sx={{ mb: 2 }}
          >
            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Email"
            />
            {touched.email && errors.email && (
              <FormHelperText error id="outlined-adornment-email-error">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(touched.currentPassword && errors.currentPassword)}
            sx={{ mb: 2 }}
          >
            <InputLabel htmlFor="outlined-adornment-current-password">Current Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-current-password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={values.currentPassword}
              name="currentPassword"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={() => handleClickShowPassword('current')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Current Password"
            />
            {touched.currentPassword && errors.currentPassword && (
              <FormHelperText error id="outlined-adornment-current-password-error">
                {errors.currentPassword}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(touched.newPassword && errors.newPassword)}
            sx={{ mb: 2 }}
          >
            <InputLabel htmlFor="outlined-adornment-new-password">New Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={values.newPassword}
              name="newPassword"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={() => handleClickShowPassword('new')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="New Password"
            />
            {touched.newPassword && errors.newPassword && (
              <FormHelperText error id="outlined-adornment-new-password-error">
                {errors.newPassword}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
            sx={{ mb: 2 }}
          >
            <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm New Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={values.confirmPassword}
              name="confirmPassword"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm new password visibility"
                    onClick={() => handleClickShowPassword('confirm')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm New Password"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <FormHelperText error id="outlined-adornment-confirm-password-error">
                {errors.confirmPassword}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Button
              disableElevation
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="secondary"
            >
              Change Password
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

const ChangePassword = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post('http://143.110.251.102:8080/register/change-password', {
        email: values.email,
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      alert(response.data.message); // Display success message
    } catch (error) {
      if (error.response) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Change Your Password
                          </Typography>
                          <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                            Enter your credentials to change your password
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <ChangePasswordForm handleSubmit={handleSubmit} />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                        Don&apos;t have an account?
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default ChangePassword;
