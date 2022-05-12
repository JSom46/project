import React, { useState } from 'react';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { TextField } from '@mui/material';
import { Button, IconButton } from '@mui/material';
import { Google, Facebook } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { Grid } from '@mui/material';
import { Dialog, LinearProgress, DialogContent, DialogActions, DialogTitle } from '@mui/material';


function logout() {
  sessionStorage.clear();
  window.location.assign("/");
  fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/logout', {
    credentials: 'include',
    method: 'GET',
  });
}
async function LoginGoogle() {
  const data = await fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/google/url?type=web', {
    method: 'GET',
    credentials: 'include'
  });
  return await data.json();
}
const LoginGoogleFunc = async e => {
  e.preventDefault();
  const response = await LoginGoogle();
  console.log(response);
  sessionStorage.setItem('msg', "logged with other");
  window.location.assign(response.url);
}
async function LoginFacebook() {
  const data = await fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/facebook/url?type=web', {
    method: 'GET',
    credentials: 'include'
  });
  return await data.json();
}
const LoginFacebookFunc = async e => {
  e.preventDefault();
  const response = await LoginFacebook();
  console.log(response);
  sessionStorage.setItem('msg', "logged with other");
  window.location.assign(response.url);
}

export default function Login(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [requestEmail, setRequestEmail] = useState(false);
  const [snackbarData, setSnackbarData] = useState({
    open: false,
    message: "",
    severity: "error"
  });

  async function loginUser(userData) {
    setLoading(true);
    try {
      const data = await fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData)
      }).then(data => data.json())
      setLoading(false);
      return data;
    }
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      'email': email,
      'password': password
    });
    console.log(response);
    if (response.msg !== 'ok') {
      setSnackbarData({
        open: true,
        message: response.msg,
        severity: "error"
      })
    }
    else {
      sessionStorage.setItem('login', response.login);
      sessionStorage.setItem('msg', "logged in");
      window.location.href = "/dashboard";
    }
  }
  async function handleRequestPasswordChange() {
    setLoading(true);
    try {
      fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/requestPasswordChange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email: requestEmail })
      }).then(response => {
        setSnackbarData({
          open: true,
          message: "Wysłano email, jeśli z tym adresem email jest powiązane konto",
          severity: "info"
        });
        setOpenChangePasswordDialog(false);
      })
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  if (sessionStorage.getItem('login') !== null)
    return (
      <div>
        <Grid container spacing={2} columns={16} justifyContent="center">
          <Grid item xs="auto" justifyItems="center">
            <h1>Zalogowany</h1>
            <h2>Login:{" " + props.auth.login}</h2>
            <div>
              <Button color="primary" onClick={logout}>Wyloguj</Button><br />
            </div>
          </Grid>
        </Grid>
      </div>
    )
  else
    return (
      <div>
        <Stack spacing={2} columns={16} alignItems="center" justifyContent="center" direction="column">
          <Typography variant="h4"> Logowanie </Typography>
          <FormControl sx={{ width: 300 }}>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <TextField type='email' id="email" label="Email" variant="standard" required onChange={e => setEmail(e.target.value)} />
                <TextField type='password' id="password" label="Hasło" variant="standard" required onChange={e => setPassword(e.target.value)} />
                <br />
                <Button variant="contained" type="submit">Zaloguj</Button>
              </FormGroup>
              <Stack direction="row" spacing={8} justifyContent="center" alignItems="center">
                <IconButton onClick={LoginGoogleFunc}> <Google /> </IconButton>
                <IconButton onClick={LoginFacebookFunc}> <Facebook /> </IconButton>
              </Stack>
            </form>
            <Alert severity={snackbarData.severity !== "" ? snackbarData.severity : "error"} hidden={!snackbarData.open}>{snackbarData.message}</Alert>
          </FormControl>
          <Button variant="standard" size="small" onClick={() => setOpenChangePasswordDialog(true)}>Zapomniałem hasła</Button>
          <CircularProgress hidden={!loading} />
        </Stack>
        <Dialog open={openChangePasswordDialog} onClose={() => setOpenChangePasswordDialog(false)} maxWidth="xs" fullWidth={true}>
          <LinearProgress hidden={!loading} />
          <DialogTitle>Podaj adres email powiązany z twoim kontem</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              required
              onChange={(e) => setRequestEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button color='success' onClick={handleRequestPasswordChange}>Wyślij</Button>
            <Button onClick={() => (setOpenChangePasswordDialog(false))}>Anuluj</Button>
          </DialogActions>
        </Dialog>
        {/* <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbarData.open}
          onClose={() => setSnackbarData((prev) => ({ open: false, message: prev.message, severity: prev.severity }))}
          autoHideDuration={5000}
        >
          <Alert onClose={() => setSnackbarData((prev) => ({ open: false, message: prev.message, severity: prev.severity }))} severity={snackbarData.severity} sx={{ width: '100%' }}>
            {snackbarData.message}
          </Alert>
        </Snackbar> */}
      </div>
    )
}