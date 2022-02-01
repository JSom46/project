//import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { BrowserRouter, Route, Switch, /*Link*/ } from 'react-router-dom';

import './App.css';
import Register from './Register';
import Login from './Login';
import Activate  from './activate';
import BootstrapNavbar from './bootstrapNavbar';

import {Row,Col} from 'reactstrap';
function App() {
  return (
  <div>
  <BrowserRouter>
  {/* <Link to="/register"><button>Rejestracja</button></Link><br />
  <Link to="/login"><button>Logowanie</button></Link><br />
  <Link to="/activate"><button>Aktywacja</button></Link><br /> */}
  <BootstrapNavbar />
  <Switch>
  <Route exact path="/" render={() => {  return ( <Redirect to="/dashboard" /> )}}  />
  <Route path="/dashboard">
  <Row style={{justifyContent:"center"}}>
    <Col md="2"><Login /></Col>
    <Col md="2"><Activate /></Col>
    <Col md="2"><Register /></Col>
  </Row>
  </Route>
  <Route path="/register">
  <Register />
  </Route>
  <Route path="/login">
  <Login />
  </Route>
  <Route path="/activate">
  <Activate />
  </Route>
  </Switch>
  </BrowserRouter>
  </div>
  );
}

export default App;