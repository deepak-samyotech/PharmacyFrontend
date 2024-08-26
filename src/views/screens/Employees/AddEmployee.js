/*eslint-disable*/
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// material-ui
import { useTheme } from "@mui/material/styles";
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
  OutlinedInput,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import useScriptRef from "hooks/useScriptRef";
import Google from "assets/images/icons/social-google.svg";
import AnimateButton from "ui-component/extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
//api call
import axios from "axios";
import Swal from "sweetalert2";
// ===========================|| FIREBASE - REGISTER ||=========================== //

const AddEmployee = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState();

  //post api call
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  //employee status
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  //   employee roll
  const handleRollChange = (event) => {
    setRole(event.target.value);
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // formData.append("firstName", firstName);
    // formData.append("lastName", lastName);
    formData.append("name", name)
    formData.append("email", email);
    formData.append("password", password);
    formData.append("contact", contact);
    formData.append("details", details);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("status", status);
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        `http://localhost:8080/employee-register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Employee Created Successfully !",
          text: "You clicked the button!",
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error !",
        text: "You clicked the button!",
        icon: "error",
      });
    }
  };

  const googleHandler = async () => {
    console.error("Register");
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword("123456");
  }, []);

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Formik
            initialValues={{
              email: "",
              password: "",
              submit: null,
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid email")
                .max(255)
                .required("Email is required"),
              password: Yup.string().max(255).required("Password is required"),
            })}
            onSubmit={async (
              values,
              { setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (scriptedRef.current) {
                  setStatus({ success: true });
                  setSubmitting(false);
                }
              } catch (err) {
                console.error(err);
                if (scriptedRef.current) {
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }
            }}
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
              <form noValidate onSubmit={handleSubmit1} {...others}>
                <Grid container spacing={matchDownSM ? 0 : 2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Employee Name"
                      margin="normal"
                      name="name"
                      type="text"
                      defaultValue=""
                      sx={{ ...theme.typography.customInput }}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      margin="normal"
                      name="lastName"
                      type="text"
                      defaultValue=""
                      sx={{ ...theme.typography.customInput }}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact"
                      margin="normal"
                      name="contact"
                      type="text"
                      defaultValue=""
                      sx={{ ...theme.typography.customInput }}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Address"
                      margin="normal"
                      name="address"
                      type="text"
                      defaultValue=""
                      sx={{ ...theme.typography.customInput }}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Details"
                      margin="normal"
                      name="details"
                      type="text"
                      defaultValue=""
                      sx={{ ...theme.typography.customInput }}
                      onChange={(e) => setDetails(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={Boolean(touched.email && errors.email)}
                      sx={{ ...theme.typography.customInput }}
                    >
                      <InputLabel htmlFor="outlined-adornment-email-register">
                        Email Address / Username
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-email-register"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setEmail(e.target.value);
                        }}
                        inputProps={{}}
                      />
                      {touched.email && errors.email && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text--register"
                        >
                          {errors.email}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="status">Employee Status</InputLabel>
                      <Select
                        labelId="status"
                        id="status"
                        value={status}
                        label="Employee Status"
                        onChange={handleStatusChange}
                      >
                        <MenuItem value={"ACTIVE"}>ACTIVE</MenuItem>
                        <MenuItem value={"INACTIVE"}>INACTIVE</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="status">Employee Roll</InputLabel>
                      <Select
                        labelId="role"
                        id="role"
                        value={role}
                        label="Employee Roll"
                        onChange={handleRollChange}
                      >
                        <MenuItem value={"SALESMAN"}>SALESMAN</MenuItem>
                        <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
                        <MenuItem value={"MANAGER"}>MANAGER</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      error={Boolean(touched.password && errors.password)}
                      sx={{ ...theme.typography.customInput }}
                    >
                      <InputLabel htmlFor="outlined-adornment-password-register">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password-register"
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        name="password"
                        label="Password"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          changePassword(e.target.value);
                          setPassword(e.target.value);
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
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        inputProps={{}}
                      />
                      {touched.password && errors.password && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-password-register"
                        >
                          {errors.password}
                        </FormHelperText>
                      )}
                    </FormControl>

                    {strength !== 0 && (
                      <FormControl fullWidth>
                        <Box sx={{ mb: 2 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item>
                              <Box
                                style={{ backgroundColor: level?.color }}
                                sx={{
                                  width: 85,
                                  height: 8,
                                  borderRadius: "7px",
                                }}
                              />
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="subtitle1"
                                fontSize="0.75rem"
                              >
                                {level?.label}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </FormControl>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <div
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        // marginLeft: "10px",
                        border: "1px solid #ccc",
                        width: "100%",
                        padding: "15px",
                        borderRadius: "10px",
                        backgroundColor: "white",
                      }}
                    >
                      <input
                        type="file"
                        onChange={handleImageChange}
                        required
                        accept="image/*"
                        style={{ width: "100%" }}
                      />
                      {errors.selectedImage && (
                        <div style={{ color: "red" }}>
                          {errors.selectedImage}
                        </div>
                      )}
                      {selectedImage && (
                        <div style={{ display: "flex", justifyContent: "end" }}>
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected"
                            style={{ maxWidth: "100%", maxHeight: "30px" }}
                          />
                        </div>
                      )}
                    </div>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={handleSubmit1}
                    >
                      Add Employee
                    </Button>
                  </AnimateButton>
                </Box>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </>
  );
};

export default AddEmployee;
