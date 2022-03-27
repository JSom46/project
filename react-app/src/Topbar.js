import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import { Dialog, DialogTitle } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import AddAnnouncement from './AddAnnouncement';
// import MUIDrawer from './Drawer'
import Divider from '@mui/material/Divider';
// import { FormGroup,FormControlLabel,Switch } from '@mui/material';

export default function MenuAppBar(props) {
  // const [auth, /*setAuth*/] = React.useState(false);
  const [accountAnchor, setAccountAnchor] = React.useState(null);
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  const [openAddAnnouncementDialog, setOpenAddAnnouncementDialog] = React.useState(false);
  const [snackbarData, setSnackbarData] = React.useState({
    open: false,
    message: ""
  });

  const ColorButton = styled(Button)(({ theme }) => ({
    '&.MuiButton-contained': {
      color: theme.palette.getContrastText(indigo[500]),
      backgroundColor: indigo[500],
    },
    '&.MuiButton-contained:hover': {
      color: theme.palette.getContrastText(indigo[700]),
      backgroundColor: indigo[700],
    },
    '&.MuiButton-outlined': {
      color: theme.palette.getContrastText(indigo[600]),
      outline: indigo[600],
    },
    '&.MuiButton-outlined:hover': {
      color: theme.palette.getContrastText(indigo[700]),
      outline: indigo[700],
    }
  }));
  React.useEffect(() => {
    try {
      fetch('http://localhost:2400/anons/notifications/count', {
        method: 'GET',
        credentials: 'include'
      }).then(response => response.json())
        .then(data => {
          if (data.count !== 0) {
            setNotificationsCount(data.count);
          }
        });
    } catch (error) {
      console.log("error", error);
    }
  }, []);
  function logout() {
    sessionStorage.removeItem('login');
    sessionStorage.removeItem('msg');
    window.location.assign("/");
    fetch('http://localhost:2400/auth/logout', {
      credentials: 'include',
      method: 'GET',
    });
  }
  const handleMenu = (event) => {
    setAccountAnchor(event.currentTarget);
  };
  const handleAddAnnouncementButton = (event) => {
    if (sessionStorage.getItem('login') !== null) {
      setOpenAddAnnouncementDialog(true);
      // setSnackbarData({ open: true, message: "text", severity: "success" });
    }
    else console.log("not logged in");
  };
  const handleAccountClose = () => {
    setAccountAnchor(null);
  };
  const handleCallback = (childData) => {
    if (childData?.id) {
      setSnackbarData({
        open: true,
        message: "Pomyślnie dodano ogłoszenie",
        severity: "success"
      });
    }
    else
      setSnackbarData({
        open: true,
        message: "Wystąpił błąd",
        severity: "error"
      });
    setOpenAddAnnouncementDialog(false);
  }
  return (
    <AppBar position="static" sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display:"flex" }}>
          <Button variant="text" sx={{ color: "white" }} href='/'>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: "flex" }}>
              PZ-XIV
            </Typography>
          </Button>
          <Button sx={{ my: 2, color: "white", display: "flex" }} onClick={handleAddAnnouncementButton}> Dodaj ogłoszenie </Button>
        </Box>
        {(props.auth?.login && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Badge badgeContent={notificationsCount} color="error" invisible={notificationsCount === 0}>
                <AccountCircle />
              </Badge>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={accountAnchor}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(accountAnchor)}
              onClose={handleAccountClose}
            >
              <MenuItem onClick={function (event) { handleAccountClose(); window.location.href = "/announcements" }}>
                <Badge variant="dot" color="error" invisible={notificationsCount === 0} anchorOrigin={{ vertical: 'top', horizontal: 'left', }}>
                  Profile
                </Badge>
              </MenuItem>
              <MenuItem onClick={function (event) { handleAccountClose(); window.location.href = "/account" }}>My account</MenuItem>
              <Divider />
              <MenuItem onClick={function (event) { logout() }}>Wyloguj</MenuItem>
            </Menu>
          </div>
        )) || (
            <div>
              <Button variant="text" sx={{ color: "white" }} href='/register'>Rejestracja</Button>
              <ColorButton variant="contained" href='/login'>Login</ColorButton>
            </div>
          )}
      </Toolbar>
      <Dialog open={openAddAnnouncementDialog} onClose={() => setOpenAddAnnouncementDialog(false)} fullWidth>
        <DialogTitle>Dodaj ogłoszenie</DialogTitle>
        <AddAnnouncement parentCallback={handleCallback} />
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
    </AppBar>
  );
}
