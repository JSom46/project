import React, { useState } from 'react';
import { BrowserRouter /*, Route, Switch*/ } from 'react-router-dom';

// import AnnoucementMy from './AnnoucementMy';
import DataGridMy from './DataGridMy';
import AddAnnouncement from './AddAnnouncement';

import { Grid, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert } from '@mui/material';


export default function Announcements(props) {
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    "value": "",
    "severity": "",
    "hidden": true
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleCallback = (childData) => {
    if(childData?.id){
      setAlert({
        "value":"Pomyślnie dodano ogłoszenie.",
        "severity":"success",
        "hidden":false
      })
      setTimeout(() => {
        setAlert({"hidden":true});
        setOpen(false);
      },3000);
    }
    else {
      setAlert({
        "value":"Pomyślnie dodano ogłoszenie.",
        "severity":"success",
        "hidden":false
      });
    }
  }
  if(sessionStorage.getItem('login') !== null)
  return (
    <BrowserRouter>
      <Grid container spacing={0} columns={16} justifyContent="center">
        <Grid item xs={10} >
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Stack direction="row" spacing={8} justifyContent="center" alignItems="center" sx={{ padding: 2 }}>
              <Button variant="outlined" onClick={handleClickOpen}>
                Dodaj ogłoszenie
              </Button>
              <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Dodaj ogłoszenie</DialogTitle>
                <AddAnnouncement parentCallback={handleCallback} disableSubmit={alert.hidden}/>
                <Alert severity={alert.severity !== "" ? alert.severity : "error"} hidden={alert.hidden}>{alert.value}</Alert>
              </Dialog>
            </Stack>
            <Typography variant="h3" gutterBottom>Twoje ogłoszenia</Typography>
            <DataGridMy />
          </Stack>
        </Grid>
      </Grid>
    </BrowserRouter>
  );
  else
  return (
    <div style={{margin:'auto'}}>
      <h4>Ta sekcja jest przeznaczona wyłącznie dla zalogowanych użytkowników.</h4>
    </div>
  );
}