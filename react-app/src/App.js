import React from 'react';
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';

import './App.css';
import Dashboard from './Dashboard';
import Register from './Register';
import Login from './Login';
import Activate  from './activate';
import useToken from './useToken';

function Logout() {
  sessionStorage.removeItem('token');
  window.location.assign("/");
  fetch('http://localhost:2400/auth/logout', {
    credentials: 'include',
    method: 'GET',
  });
}
async function LoggedinTest() {
  const data = await fetch('http://localhost:2400/auth/loggedin', {
    method: 'GET',
    credentials: 'include'
  });
  return await data.json();
}
const LoggedInTestFunc = async e => {
  e.preventDefault();
  const response = await LoggedinTest();
  console.log(response);
}
async function LoginGoogle() {
  const data = await fetch('http://localhost:2400/auth/google/url', {
    method: 'GET',
    credentials: 'include'
  });
  return await data.json();
}
const LoginGoogleFunc = async e => {
  e.preventDefault();
  const response = await LoginGoogle();
  console.log(response);
  window.location.assign(response.url);
}
async function LoginFacebook() {
  const data = await fetch('http://localhost:2400/auth/facebook/url', {
    method: 'GET',
    credentials: 'include'
  });
  return await data.json();
}
const LoginFacebookFunc = async e => {
  e.preventDefault();
  const response = await LoginFacebook();
  console.log(response);
  window.location.assign(response.url);
}
function App() {

  const { token, setToken } = useToken();

  if(!token) {
    return (
    <div style={{margin: "auto"}}>
    <BrowserRouter>
    <button onClick={LoggedInTestFunc}>LoggedInTest</button><br />
    <button onClick={LoginGoogleFunc}>LogowanieGoogle</button><br />
    <button onClick={LoginFacebookFunc}>LogowanieFacebook</button><br />
      <Link to="/register"><button>Rejestracja</button></Link><br />
      <Link to="/login"><button>Logowanie</button></Link><br />
      <Link to="/activate"><button>Aktywacja</button></Link><br />
         <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
           <Login setToken={setToken} />
          </Route>
          <Route path="/activate">
           <Activate />
          </Route>
        </Switch> 
      </BrowserRouter>
    </div>
    );
  }

  return (
    <div className="wrapper">
      <h1>Zalogowano</h1>
      <BrowserRouter>
      <button onClick={LoggedInTestFunc}>LoggedInTest</button><br />
      <button onClick={Logout}>Wyloguj</button>
      <Link to="/dashboard"><button>Dashboard</button></Link>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/register">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;