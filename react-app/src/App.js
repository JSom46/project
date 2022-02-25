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

// import Grid from '@mui/material/Grid';
// import Item from '@mui/material/ListItem';



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
      console.log(json);
      setAuth(json);
      if(json.login !== undefined) sessionStorage.setItem('login',json.login);
      else sessionStorage.removeItem('login');
      sessionStorage.setItem('msg',json.msg);
      // console.log(json.login);
    } catch (error) {
      console.log("error", error);
    }
  };
  if(sessionStorage.getItem('msg') === "logged in" || sessionStorage.getItem('msg') === "logged with other") fetchData();
  else if(sessionStorage.getItem('login') !== null){
    setAuth({
      "login": sessionStorage.getItem('login'),
    });
  }
  else {
    setAuth({
      // "login": sessionStorage.getItem('login'),
      "msg": "not logged in"
    });
  }
}, []);
return (
  <div>
  <BrowserRouter>
  <MenuAppBar auth={auth}/>
  {/* <Grid container spacing={2} columns={16} justifyContent="center">
  <Grid item xs="auto" justifyItems="center">
<Item> */}
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
{/* </Item>
  </Grid>
</Grid> */}
</BrowserRouter>
</div>
);
}
export default App;