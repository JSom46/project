import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MUIDrawer from './Drawer'
// import { FormGroup,FormControlLabel,Switch } from '@mui/material';

export default function MenuAppBar(props) {
  // const [auth, /*setAuth*/] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  // const handleChange = (event) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={props.auth}
              // onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={props.auth ? 'Logout' : 'Login'}
        />
      </FormGroup> */}
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <MUIDrawer />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PZ-XIV
          </Typography>
          {props.auth?.login && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={function(event){handleClose();window.location.href="/profile"}}>Profile</MenuItem>
                <MenuItem onClick={function(event){handleClose();window.location.href="/account"}}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
