import React, { useState } from 'react';
import { Stack, Typography, FormControl, FormGroup, TextField, Button, Snackbar, Alert } from '@mui/material';
import { CircularProgress } from '@mui/material';



export default function ChangePassword() {
  const [password, setPassword] = useState({
    "value": "",
    "isValid": false,
    "errors": ""
  });
  const [passwordRepeat, setPasswordRepeat] = useState({
    "value": "",
    "isValid": false,
    "errors": ""
  });
  const [snackbarData, setSnackbarData] = React.useState({
    open: false,
    message: "",
    severity: "error"
  });

  async function changePassword(userData) {
    const requestData = {
      id: userData.id,
      token: userData.token,
      password: userData.pass
    }
    // console.log(requestData);
    fetch('http://localhost:2400/auth/passwordChange', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(requestData)
    }).then((data) => {
      if (data.status === 200) {
        setSnackbarData({
          open: true,
          message: "Pomyślnie zmieniono hasło",
          severity: "success"
        })
      } else if (data.status === 404) {
        setSnackbarData({
          open: true,
          message: "Błąd: 404. Token już wygasł?",
          severity: "error"
        })
      } else if (data.status === 500) {
        setSnackbarData({
          open: true,
          message: "Błąd po stronie serwera",
          severity: "error"
        })
      }
    })
  }
  const handleSubmit = async e => {
    e.preventDefault();
    if (validate()) {
      return -1;
    }
    let paramString = window.location.search;
    let searchParams = new URLSearchParams(paramString);
    var id = searchParams.get("id");
    var token = searchParams.get("token");
    var pass = password.value;
    await changePassword({
      id,
      token,
      pass,
    });
  }

  const passwordValidator = require('password-validator');
  const schema = new passwordValidator();
  schema.is().min(8).is().max(50).has().uppercase().has().lowercase().has().digits(2).has().not().spaces();
  const validate = () => {
    let isInvalid = false;
    if (schema.validate(password.value)) {
      setPassword({
        "value": password.value,
        "isValid": false,
        "errors": ""
      })
    }
    else {
      isInvalid = true;
      setPassword({
        "value": password.value,
        "isValid": true,
        "errors": "Hasło nie jest wystarczająco silne"
      })
    }
    if (password.value === passwordRepeat.value) {
      setPasswordRepeat({
        "value": passwordRepeat.value,
        "isValid": false,
        "errors": ""
      })
    }
    else {
      isInvalid = true;
      setPasswordRepeat({
        "value": passwordRepeat.value,
        "isValid": true,
        "errors": "Hasła nie są takie same"
      })
    }
    return isInvalid;
  }

  return (
    <div>
      <Stack spacing={2} columns={16} alignItems="center" justifyContent="center" direction="column">
        <Typography variant="h4"> Zmiana hasła </Typography>
        <FormControl sx={{ width: 300 }}>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <TextField type='password' id="password" label="Nowe hasło" variant="standard" error={password.isValid} helperText={password.errors} required onChange={e => setPassword({ value: e.target.value })} />
              <TextField type='password' id="repeatPassword" label="Powtórz nowe hasło" variant="standard" error={passwordRepeat.isValid} helperText={passwordRepeat.errors} required onChange={e => setPasswordRepeat({ value: e.target.value })} />
              <br />
              <Button variant="contained" type="submit">Zmień hasło</Button>
            </FormGroup>
          </form>
        </FormControl>
        {/* <CircularProgress hidden={!loading} /> */}
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbarData.open}
        onClose={() => setSnackbarData((prev) => ({ open: false, message: prev.message, severity: prev.severity }))}
        autoHideDuration={5000}
      >
        <Alert onClose={() => setSnackbarData((prev) => ({ open: false, message: prev.message, severity: prev.severity }))} severity={snackbarData.severity} sx={{ width: '100%' }}>
          {snackbarData.message}
        </Alert>
      </Snackbar>
    </div>
  )
}