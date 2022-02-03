//import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { BrowserRouter, Route, Switch,useParams /*Link*/ } from 'react-router-dom';

import './App.css';
import Register from './Register';
import Login from './Login';
import Activate  from './activate';
import MenuAppBar from './Topbar';

import Grid from '@mui/material/Grid';
import Item from '@mui/material/ListItem';


function App() {
  return (
    <div>
    <BrowserRouter>
    {/* <Link to="/register"><button>Rejestracja</button></Link><br />
    <Link to="/login"><button>Logowanie</button></Link><br />
  <Link to="/activate"><button>Aktywacja</button></Link><br /> */}
  {/* <BootstrapNavbar /> */}
  <MenuAppBar/>
  <Grid container spacing={2} columns={16} justifyContent="center">
  <Grid item xs="auto" justifyItems="center">
  <Item style={{border:"1px solid"}}>
  <Switch>
  <Route exact path="/" render={() => {  return ( <Redirect to="/dashboard" /> )}}  />
  <Route path="/dashboard">
  </Route>
  <Route path="/register">
  <Register />
  </Route>
  <Route path="/login">
  <Login />
  </Route>
  <Route path="/activate/:id" children={<Activate />}>
  </Route>
  </Switch>
  </Item>
  </Grid>
  </Grid>
  
  </BrowserRouter>
  </div>
  );
}
export default App;