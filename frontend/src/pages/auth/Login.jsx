// pages/LoginPage.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ButtonBox from "../../components/Button";
import Toast from "../../components/Toast";
import { endPoints } from "../../utils/endpoints";
import api from "../../utils/apiInterceptor";
import Cookies from 'js-cookie';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [open, setOpen] = React.useState(false);
  const [snackbarProps, setSnackbarProps] = useState({
    message: "",
    severity: "success",
  });
  //   const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !password || !role) {
        return handleClick("Please fill all details", "error");
      }

      let payload = {
        email: email,
        password: password,
        role: role,
      };

      const response = await api.post(endPoints.login, payload);
      console.log('response',response);

      if (response.data?.statusCode == 200 || 201) {
        Cookies.set("access_token",response.data?.data?.token);
        Cookies.set("role",response?.data?.data?.user?.role);
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("error", error);
      return handleClick(error?.response?.data?.message, "error");
    }
  };

  return (
    <Container maxWidth="sm">
      {/* <Button onClick={() => handleClick("Operation successful!", "success")}>
        Show Success Snackbar
      </Button>
      <Button onClick={() => handleClick("An error occurred.", "error")}>
        Show Error Snackbar
      </Button> */}

      <Toast
        open={open}
        message={snackbarProps.message}
        severity={snackbarProps.severity}
        onClose={handleClose}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box
          // component="form"
          // onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 400,
            mt: 3,
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "background.paper",
          }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth required margin="normal" variant="outlined">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>

          <div className="mt-4">
            <ButtonBox
              label={"Login"}
              variant={"contained"}
              color={"primary"}
              fullWidth={"fullWidth"}
              onClick={handleSubmit}
            />
          </div>

          <div className="mt-4">
            <ButtonBox
              label={"Register"}
              variant={"contained"}
              color={"primary"}
              fullWidth={"fullWidth"}
              onClick={() => navigate("/signup")}
            />
          </div>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
