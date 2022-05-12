import React from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Typography, Button, TextField } from '@mui/material';
import { LinearProgress } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { Dialog, DialogActions, DialogTitle } from '@mui/material';

export default function Account(props) {
  const [userData, setUserData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [loginField, setLoginField] = React.useState(props.auth.login);
  const [openEditLogin, setOpenEditLogin] = React.useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = React.useState(false);
  const [snackbarData, setSnackbarData] = React.useState({
    open: false,
    message: "",
    severity: "success"
  });

  React.useEffect(() => {
    const fetchData = async () => {
      setUserData([]);
      let url = process.env.REACT_APP_SERVER_ROOT_URL + '/auth/user';
      try {
        await fetch(url, {
          method: 'GET',
          credentials: 'include'
        }).then((response) => {
          if (response.status === 401) {
            sessionStorage.clear();
            window.location.assign("/login");
            return;
          }
          response.json().then(
            (data) => {
              // console.log(data);
              setUserData(data);
              setLoginField(data.login);
            });
        })
      } catch (error) {
        // setFetchError(true);
        console.log("error", error);
      }
    };
    fetchData();
  }, [reload]);

  async function editLogin() {
    setLoading(true);
    try {
      fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ new_login: loginField })
      }).then(response => {
        if (response.status === 200) {
          setSnackbarData({
            open: true,
            message: "Pomyślnie zmieniono login",
            severity: "success"
          });
          setOpenEditLogin(false);
          setReload((prev) => !(prev));
        }
      })
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.log(error);
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
        body: JSON.stringify({ email: userData.email })
      }).then(response => {
        if (response.status === 200) {
          setSnackbarData({
            open: true,
            message: "Wysłano email. Sprawdź swoją skrzynkę pocztową.",
            severity: "success"
          });
          setOpenChangePasswordDialog(false);
        }
      })
      setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  if (props.auth.msg === 'not logged in') return (<Redirect to="/login" />)
  return (
    <Box alignSelf="center">
      <Card sx={{ minWidth: 275, maxWidth: 400 }}>
        <LinearProgress hidden={userData.length !== 0} />
        <CardContent >
          <Typography variant='h5' gutterBottom hidden={openEditLogin}>
            {userData.login}
          </Typography>
          {loginField && <TextField hidden={!openEditLogin} value={loginField} variant="standard" type='text' onChange={(e) => setLoginField(e.target.value)} fullWidth />}
          <Typography variant='h6' gutterBottom>
            {userData.email}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "right", flex: 1 }}>
          <Button size="small" onClick={() => setOpenEditLogin((prev) => !(prev))} hidden={openEditLogin}>Zmień nazwę użytkownika</Button>
          <Button size="small" hidden={openEditLogin} onClick={() => setOpenChangePasswordDialog(true)}>Zmień hasło</Button>
          <Button size="small" color="error" onClick={() => { setOpenEditLogin((prev) => !(prev)); setLoginField(userData.login) }} hidden={!openEditLogin}>Anuluj</Button>
          <Button size="small" color="success" hidden={!openEditLogin} onClick={() => editLogin()}>Zapisz</Button>
        </CardActions>
        <LinearProgress hidden={!loading} />
        <Dialog open={openChangePasswordDialog} onClose={() => setOpenChangePasswordDialog(false)} maxWidth="xs" fullWidth={true}>
          <LinearProgress hidden={!loading} />
          <DialogTitle>Wysłać email z linkiem do zmiany hasła?</DialogTitle>
          <DialogActions>
            <Button color='success' onClick={handleRequestPasswordChange}>Wyślij</Button>
            <Button onClick={() => (setOpenChangePasswordDialog(false))}>Anuluj</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbarData.open}
          onClose={() => setSnackbarData({ open: false })}
          autoHideDuration={5000}
        >
          <Alert onClose={() => setSnackbarData({ open: false })} severity={snackbarData.severity} sx={{ width: '100%' }}>
            {snackbarData.message}
          </Alert>
        </Snackbar>
      </Card>
    </Box>
  )
}