import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';
import { Dialog, DialogTitle } from '@mui/material';
import { Tooltip } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { Alert, IconButton } from '@mui/material';
import AddAnnouncement from './AddAnnouncement';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
// import MUIDrawer from './Drawer'
import Divider from '@mui/material/Divider';
// import { FormGroup,FormControlLabel,Switch } from '@mui/material';

export default function MenuAppBar(props) {
  // const [auth, /*setAuth*/] = React.useState(false);
  const [accountAnchor, setAccountAnchor] = React.useState(null);
  const [notificationsCount, setNotificationsCount] = React.useState(0);
  const [messagesCount, setMessagesCount] = React.useState(0);
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
  const fetchNotifications = () => {
    try {
      fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/anons/notifications/count', {
        method: 'GET',
        credentials: 'include'
      }).then(response => {
        if (response.status === 401) sessionStorage.clear();
        response.json().then(data => {
          // console.log(data);
          sessionStorage.setItem('notificationsCount', data.count);
          setNotificationsCount(data.count);
        });
      })
    } catch (error) {
      console.log("error", error);
    }
  }
  const fetchChatMessages = () => {
    try {
      fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/anons/messages', {
        method: 'GET',
        credentials: 'include'
      }).then(response => {
        if (response.status === 401) sessionStorage.clear();
        response.json().then(data => {
          sessionStorage.setItem('messagesCount', data.count);
          setMessagesCount(data.count);
        });
      })
    } catch (error) {
      console.log("error", error);
    }
  }
  React.useEffect(() => {
    if ((sessionStorage.getItem('messagesCount') === null || sessionStorage.getItem('notificationsCount') === null) && sessionStorage.getItem('login') !== null) {
      fetchNotifications();
      fetchChatMessages();
    }
    else if (sessionStorage.getItem('messagesCount') !== null) {
      setMessagesCount(parseInt(sessionStorage.getItem('messagesCount')));
      setNotificationsCount(parseInt(sessionStorage.getItem('notificationsCount')));
      sessionStorage.removeItem('messagesCount');
      sessionStorage.removeItem('notificationsCount');
    }
    const interval = setInterval(() => {
      if(sessionStorage.getItem('login') !== null){
        fetchNotifications();
        fetchChatMessages();
      }
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  function logout() {
    sessionStorage.clear();
    window.location.assign("/");
    fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/logout', {
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
        message: "Pomy??lnie dodano og??oszenie",
        severity: "success"
      });
    }
    else
      setSnackbarData({
        open: true,
        message: "Wyst??pi?? b????d",
        severity: "error"
      });
    setOpenAddAnnouncementDialog(false);
  }
  return (
    <AppBar position="static" sx={{ maxHeight: '60px', flexGrow: 1 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'none', md: 'flex' } }}>
          <Button variant="text" sx={{ textTransform: 'none', color: "white" }} href='/' startIcon={<img src='./logo_white.png' width='48px' height='48px' alt='logo'/>}>
            <Typography variant="h6" noWrap component="div" sx={{ mr: 2, display: "flex" }}>
              Zwierzoznajd??ca
            </Typography>
          </Button>
          <Tooltip title={sessionStorage.getItem('login') === null ? "Dodawanie og??osze?? jest tylko dla zalogowanych u??ytkownik??w" : ""}>
            <span>
              <Button disabled={sessionStorage.getItem('login') === null} sx={{ my: 2, color: "white", display: "flex" }} onClick={handleAddAnnouncementButton} endIcon={<AddIcon />}>
                Dodaj og??oszenie
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={sessionStorage.getItem('login') === null ? "Czat jest tylko dla zalogowanych u??ytkownik??w" : ""} >
            <span>
              <Button disabled={sessionStorage.getItem('login') === null} sx={{ my: 2, ml: 2, color: "white", display: "flex" }} onClick={() => window.location.href = "/chat"}
                endIcon={
                  //<Badge badgeContent={messagesCount} color="secondary">
                    <ChatIcon />
                 // </Badge>
                }>

                Czat

              </Button>
            </span>
          </Tooltip>
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'flex', md: 'none' } }}>
          <IconButton href='/'>
            <img src='./logo_white.png' width='48px' height='48px' alt='logo'/>
          </IconButton>
          <Tooltip title={sessionStorage.getItem('login') === null ? "Dodawanie og??osze?? jest tylko dla zalogowanych u??ytkownik??w" : ""}>
            <span>
              <IconButton disabled={sessionStorage.getItem('login') === null} sx={{ my: 2, color: 'white', display: "flex" }} onClick={handleAddAnnouncementButton} >
                <AddIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={sessionStorage.getItem('login') === null ? "Czat jest tylko dla zalogowanych u??ytkownik??w" : ""} >
            <span>
              <IconButton disabled={sessionStorage.getItem('login') === null} sx={{ my: 2, ml: 2, color: 'white', display: "flex" }} onClick={() => window.location.href = "/chat"}>
                <ChatIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        {(props.auth?.login && (
          <div>
            <Badge badgeContent={notificationsCount || messagesCount} color={notificationsCount > messagesCount ? "error" : "secondary"} variant="dot">
              <Button
                size="small"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                endIcon={<AccountCircle />}
              >
                {sessionStorage.getItem('login')}
              </Button>
            </Badge>
            <Menu
              id="menu-appbar"
              anchorEl={accountAnchor}
              anchorOrigin={{
                vertical: 'bottom',
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
                <Badge badgeContent={notificationsCount} variant="dot" color="error" anchorOrigin={{ vertical: 'top', horizontal: 'right', }}>
                  Moje og??oszenia
                </Badge>
              </MenuItem>
              <MenuItem onClick={function (event) { handleAccountClose(); window.location.href = "/account" }}>Moje konto</MenuItem>
              <MenuItem onClick={function (event) { handleAccountClose(); window.location.href = "/chat" }}>
                {/* <Badge badgeContent={messagesCount} color="secondary" variant="dot"> */}
                  Czat
                {/* </Badge> */}
              </MenuItem>
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
        <DialogTitle>Dodaj og??oszenie</DialogTitle>
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
