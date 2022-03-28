import React, { useState /*useEffect*/ } from 'react';
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { TextField } from '@mui/material';
import { Button, IconButton } from '@mui/material';
import { Google, Facebook } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Grid } from '@mui/material';

import './login.css'


async function loginUser(userData) {
  const data = fetch('http://localhost:2400/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(userData)
  }).then(data => data.json())
  return await data;
}
function logout() {
  sessionStorage.removeItem('login');
  sessionStorage.removeItem('msg');
  window.location.assign("/");
  fetch('http://localhost:2400/auth/logout', {
    credentials: 'include',
    method: 'GET',
  });
}
async function LoginGoogle() {
  const data = await fetch('http://localhost:2400/auth/google/url?type=web', {
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
  const data = await fetch('http://localhost:2400/auth/facebook/url?type=web', {
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
  const formData = new FormData();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      'email': formData.get('email'),
      'password': formData.get('password')
    });
    console.log(response);
    if (response.msg !== 'ok') {
      errorMessage(response.msg);
    }
    else {
      sessionStorage.setItem('msg', "logged in");
      window.location.reload();
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
        <Grid container spacing={2} columns={16} justifyContent="center">
          <Grid item xs="auto" justifyItems="center">
            <Typography variant="h4"> Logowanie </Typography>
            <FormControl sx={{ width: 300 }}>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <TextField type='email' id="email" label="Email" variant="standard" required onChange={e => formData.set('email', e.target.value)} />
                  <TextField type='password' id="password" label="Hasło" variant="standard" required onChange={e => formData.set('password', e.target.value)} />
                  <br />
                  <Button variant="contained" type="submit">Zaloguj</Button>
                </FormGroup>
                <Stack direction="row" spacing={8} justifyContent="center" alignItems="center">
                  <IconButton onClick={LoginGoogleFunc}> <Google /> </IconButton>
                  <IconButton onClick={LoginFacebookFunc}> <Facebook /> </IconButton>
                </Stack>
              </form>
            </FormControl>
            <p id="loginError">&nbsp;</p>
          </Grid>
        </Grid>
      </div>
    )
  function errorMessage(msg) {
    var element = document.getElementById("loginError");
    if (msg === 'invalid password') {
      var textfield = document.getElementById("password");
      textfield.setAttribute("error");
    }
    element.style.color = "red";
    element.innerHTML = msg;
  }
}