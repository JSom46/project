import React, { useState } from 'react';
import './login.css'
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import { Alert } from '@mui/material';
import { Grid } from '@mui/material';


async function registerUser(credentials) {
  credentials.password = credentials.password.value;
  // console.log(credentials);
    return fetch('http://localhost:2400/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function Register() {
  const [alert, setAlert] = useState({
    "value": "",
    "severity": "",
    "hidden": true
  });
  const [login, setLogin] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState({
    "value": "",
    "isValid": true,
    "errors": ""
  });
  const [passwordRepeat, setPasswordRepeat] = useState({
    "value": "",
    "isValid": true,
    "errors": ""
  });

  const passwordValidator = require('password-validator');
  const schema = new passwordValidator();
  schema.is().min(8).is().max(50).has().uppercase().has().lowercase().has().digits(2).has().not().spaces();
  const validate = () =>{
    let isInvalid = false;
    if(schema.validate(password.value)){
      setPassword({
        "value": password.value,
        "isValid": true,
        "errors": ""
      })
    }
    else {
      isInvalid = true;
      setPassword({
        "value": password.value,
        "isValid":false,
        "errors": "Hasło nie jest wystarczająco silne"
      })
    }
    if(password.value === passwordRepeat.value){
      setPasswordRepeat({
        "value": passwordRepeat.value,
        "isValid": true,
        "errors": ""
      })
    }
    else {
      isInvalid = true;
      setPasswordRepeat({
        "value": passwordRepeat.value,
        "isValid":false,
        "errors": "Hasła nie są takie same"
      })
    }
    return isInvalid;
  }
  const handleSubmit = async e => {
    e.preventDefault();
    if(validate()){
      return -1;
    }
    const response = await registerUser({
      login,
      email,
      password
    });
    if(response.msg === 'account created'){
      setAlert({
        "value": "Pomyślnie utworzono konto. Sprawdź e-mail w celu aktywacji konta.",
        "severity": "success",
        "hidden": false
      })
    }
    else if(response.msg === 'email already in use'){
      setAlert({
        "value": "E-mail jest już w użyciu.",
        "severity": "error",
        "hidden": false
      })
    }
  }
  return(
    <div>
    <Grid container spacing={2} columns={16} justifyContent="center">
    <Grid item xs="auto" justifyItems="center">
    <Typography variant="h4"> Rejestracja </Typography>
    <FormControl sx={{width:300}}>
    <form onSubmit={handleSubmit}>
    <FormGroup>
    <TextField type='text' id="username" label="Login" variant="standard" required onChange={e => setLogin(e.target.value)} />
    <TextField type='email' id="email" label="Email" variant="standard" required onChange={e => setEmail(e.target.value)} />
    <TextField type='password' id="password" label="Hasło" variant="standard" error={!password.isValid} helperText={password.errors} required onChange={e => setPassword({"value": e.target.value, "isValid":true}) } />
    <TextField type='password' id="passwordRepeat" label="Powtórz hasło" variant="standard" error={!passwordRepeat.isValid} helperText={passwordRepeat.errors} required onChange={e => setPasswordRepeat({"value": e.target.value, "isValid":true})} />
    </FormGroup>
    <br />
    <Button variant="contained" type="submit" onClick={handleSubmit}>Zarejestruj</Button>
    </form>
    <Alert severity={alert.severity !== "" ? alert.severity : "error"} hidden={alert.hidden}>{alert.value}</Alert>
    </FormControl>
    </Grid>
    </Grid>
    </div>
  )
}