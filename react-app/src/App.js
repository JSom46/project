//import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import './App.css';
import Register from './Register';
import Login from './Login';
import Activate  from './activate';

function App() {
    return (
    <div style={{marginRight: 10 + 'em'}}>
    <BrowserRouter>
      <Link to="/register"><button>Rejestracja</button></Link><br />
      <Link to="/login"><button>Logowanie</button></Link><br />
      <Link to="/activate"><button>Aktywacja</button></Link><br />
         <Switch>
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