import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
        <List>
          <ListItem button component="a" href="/dashboard">
            <ListItemText primary={'PZ-XIV'} />
          </ListItem>
        </List>
    <Divider />
      <List>
        <ListItem button component="a" href="/announcements">
          <ListItemText primary={'Zarządzanie ogłoszeniami'} />
        </ListItem>
      </List>
    <Divider />
      <List>
        <ListItem button key={'Login'} component="a" href="/login">
          <ListItemIcon>
              <LoginIcon />
          </ListItemIcon>
          <ListItemText primary={'Login'} />
        </ListItem>
        <ListItem button key={'Rejestracja'} component="a" href="/register">
          <ListItemIcon>
              <AppRegistrationIcon />
          </ListItemIcon>
          <ListItemText primary={'Rejestracja'} />
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>    
            <IconButton onClick={toggleDrawer(anchor, true)}
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
            <MenuIcon />
            </IconButton>
          <Drawer
            variant='temporary'
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
