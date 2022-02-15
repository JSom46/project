//import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { BrowserRouter, Route, Switch /*Link*/ } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import './App.css';
import Register from './Register';
import Login from './Login';
import Activate  from './Activate';
import MenuAppBar from './Topbar';
import Profile from './Profile';
import Account from './Account';
import Dashboard from './Dashboard';

import Grid from '@mui/material/Grid';
import Item from '@mui/material/ListItem';



function App() {
  const [auth, setAuth] = useState("");
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:2400/auth/loggedin', {
        method: 'GET',
        credentials: 'include'
      });
      const json = await response.json();
      //console.log(json);
      setAuth(json);
    } catch (error) {
      console.log("error", error);
    }
  };
  fetchData();
}, []);
//console.log(auth);
  return (
    <div>
    <BrowserRouter>
    {/* <Link to="/register"><button>Rejestracja</button></Link><br />
    <Link to="/login"><button>Logowanie</button></Link><br />
  <Link to="/activate"><button>Aktywacja</button></Link><br /> */}
  {/* <BootstrapNavbar /> */}
  <MenuAppBar auth={auth}/>
  <Grid container spacing={2} columns={16} justifyContent="center">
  <Grid item xs="auto" justifyItems="center">
  <Item>
  <Switch>
  <Route exact path="/" render={() => {  return ( <Redirect to="/dashboard" /> )}}  />
  <Route path="/dashboard">
  <Dashboard auth={auth}/>
  </Route>
  <Route path="/register">
  <Register auth={auth}/>
  </Route>
  <Route path="/login">
  <Login auth={auth}/>
  </Route>
  <Route path="/activate" children={<Activate />} />
  <Route path="/profile" children={<Profile auth={auth}/>}/>
  <Route path="/account" children={<Account auth={auth}/>}/>
  </Switch>
  </Item>
  </Grid>
  </Grid>
  
  </BrowserRouter>
  </div>
  );
}
export default App;