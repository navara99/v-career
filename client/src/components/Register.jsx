import React from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  InputAdornment,
  TextField,
  Box,
} from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import useInput from "../hooks/useInput";
import axios from "axios";
import Unauthorized from "./Unauthorized";
import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";

function Register({
  setErrorMessage,
  setShowError,
  setCurrentUser,
  currentUser,
  logout,
}) {
  const [email, handleEmailChange] = useInput("");
  const [username, handleUsernameChange] = useInput("");
  const [password, handlePasswordChange] = useInput("");
  const [confirmPassword, handleConfirmPasswordChange] = useInput("");
  const [firstName, handleFirstNameChange] = useInput("");
  const [lastName, handleLastNameChange] = useInput("");
  useTitle("Register");
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    const userInfo = {
      email,
      username,
      password,
      confirmPassword,
      firstName,
      lastName,
    };

    try {
      const { data } = await axios.post("/api/users/register", userInfo);
      const { error } = data;
      if (error) {
        setErrorMessage(error);
        setShowError(true);
      }
      if (!error) {
        setCurrentUser(data);
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  if (currentUser) {
    return (
      <Unauthorized action="register for another account" logout={logout} />
    );
  }

  return (
    <Container className="centered-container">
      <form onSubmit={registerUser}>
        <Grid
          container
          direction="column"
          alignItems="center"
          style={{ width: "100%", margin: 0 }}
          justifyContent="center"
          spacing={2}
        >
          <Grid item>
            <Typography component="div" className="title-logo">
              <img src="/icon.png" alt="vCareer" />
              <h2>Register</h2>
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              onChange={handleFirstNameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              label="First Name"
              error={false}
              required
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              onChange={handleLastNameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              label="Last Name"
              error={false}
              required
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              onChange={handleEmailChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              label="Email"
              type="email"
              error={false}
              required
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              onChange={handleUsernameChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              label="Username"
              error={false}
              required
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Password"
              error={false}
              helperText={""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
              onChange={handlePasswordChange}
              type="password"
              required
            ></TextField>
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Confirm Password"
              error={false}
              helperText={""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
              onChange={handleConfirmPasswordChange}
              type="password"
              required
            ></TextField>
          </Grid>
          <Grid item>
            <Button
              size="large"
              variant="contained"
              color="primary"
              type="submit"
            >
              Sign Up
            </Button>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center" style={{ width: "100%" }}>
              <Typography component="div">
                <h5>Already have an account?</h5>
              </Typography>
              <Button color="primary" href="/login">
                Login
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default Register;
