// LoginForm.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Typography,
  Container
} from '@mui/material';
import ButtonBox from '../../components/Button';
import Cookies from 'js-cookie';

import Toast from "../../components/Toast";
import { endPoints } from "../../utils/endpoints";
import api from "../../utils/apiInterceptor";

import { useNavigate } from 'react-router-dom';

const roles = ['Manager', 'Employee'];
const genders = ['Male', 'Female', 'Other'];

const SignUp = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    gender: '',
    hobbies: '',
  });

  const [open, setOpen] = React.useState(false);
  const [snackbarProps, setSnackbarProps] = useState({
    message: "",
    severity: "success",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = (message, severity) => {
    setSnackbarProps({ message, severity });
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleSignUp = async(e) => {
    e.preventDefault();
    
    console.log(formData);

    try {
      if (!formData.email  || !formData.password || !formData.role || !formData.firstName || !formData.lastName || !formData.gender) {
        return handleClick("Please fill all details", "error");
      }

      // Password validation logic
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    return handleClick(passwordError, "error");
  }

   
      const response = await api.post(endPoints.signup, formData);
     
      
      if (response.data?.statusCode == 200 || 201) {
        Cookies.set("access_token",response.data?.data?.token);
        Cookies.set("role",response?.data?.data?.newUser?.role);
        Cookies.set("id",response?.data?.data?.newUser?.id);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error", error);
      return handleClick(error?.response?.data?.message, "error");
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 20;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    if (password.length < minLength || password.length > maxLength) {
      return 'Password must be between 8 and 20 characters.';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number.';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character.';
    }
  
    return ''; // Valid password
  };
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    const error = validatePassword(value);

    setPasswordError(error);
    handleChange(e); // Call the original handleChange function
  };

  return (
    <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
          SignUp
        </Typography>
        <Toast
        open={open}
        message={snackbarProps.message}
        severity={snackbarProps.severity}
        onClose={handleClose}
      />
    <Box
      // component="form"
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        borderRadius: 1,
        boxShadow: 3,
      }}
      noValidate
      autoComplete="off"
      // onSubmit={handleSubmit}
    >
      <TextField
        fullWidth
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
      />
     <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handlePasswordChange}
        margin="normal"
        required
        error={!!passwordError}
        helperText={passwordError}
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Role</InputLabel>
        <Select
          name="role"
          value={formData.role}
          onChange={handleChange}
          label="Role"
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          label="Gender"
        >
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender}>
              {gender}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Hobbies"
        name="hobbies"
        value={formData.hobbies}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
      />
      {/* <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Submit
      </Button> */}
      <div className='mt-4'>
              <ButtonBox label={"Submit"} variant={"contained"} color={"primary"} fullWidth={"fullWidth"} onClick={handleSignUp}  />
          </div>
          
          <div className='mt-4'>
              <ButtonBox label={"Login"} variant={"contained"} color={"primary"} fullWidth={"fullWidth"} onClick={()=> navigate("/")} />
          </div>
    </Box>
    </Container>
  );
};

export default SignUp;
