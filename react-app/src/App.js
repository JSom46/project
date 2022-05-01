//import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { BrowserRouter, Route, Switch /*Link*/ } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import './App.css';
import Register from './Register';
import Login from './Login';
import Activate from './Activate';
import MenuAppBar from './Topbar';
import Profile from './Profile';
import Account from './Account';
import Dashboard from './Dashboard';
import Announcements from './Announcements';
import Footer from './Footer';
import ChangePassword from './ChangePassword';
import Chat from './Chat';
import Faq from './Faq';
import Team from './Team';

//import MapTesting from './MapTesting'; //TEMP
import { Box } from '@mui/material';



function App() {
  const [auth, setAuth] = useState("");
  const [anonsId, setAnonsId] = useState(-1);
  const chatRedirect = (id) => {
    // console.log(id);
    setAnonsId(id);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetch('http://localhost:2400/auth/user', {
          method: 'GET',
          credentials: 'include'
        }).then(response => {
          if (response.status === 200) {
            response.json().then(data => {
              sessionStorage.removeItem('msg');
              sessionStorage.setItem('login', data.login);
              setAuth(data);
            });
          }
          else {
            if (response.status === 403) {
              sessionStorage.setItem('msg', 'not logged in');
              sessionStorage.removeItem('login');
            };
            throw new Error('Response not ok')
          }
        })
      } catch (error) {
        console.log("error", error);
      }
    };
    if (sessionStorage.getItem('msg') === "logged in" || sessionStorage.getItem('msg') === "logged with other" || sessionStorage.getItem('msg') === null
      || (sessionStorage.getItem('msg') === "ok" && sessionStorage.getItem('login') === null)) fetchData();
    else if (sessionStorage.getItem('login') !== null) {
      setAuth({
        "login": sessionStorage.getItem('login'),
      });
    }
    else {
      setAuth({
        "msg": "not logged in"
      });
    }
  }, []);
  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', }}>
        <BrowserRouter>
          <MenuAppBar auth={auth} />
          <Switch>
            <Route exact path="/" render={() => { return (<Redirect to="/dashboard" />) }} />
            <Route path="/dashboard">
              <Dashboard auth={auth} chatRedirect={chatRedirect}/>
              {(anonsId !== -1) && <Redirect to={{pathname: "/chat", state:{id:anonsId}}} />}
            </Route>
            <Route path="/announcements">
              <Announcements auth={auth} />
            </Route>
            <Route path="/register">
              <Register auth={auth} />
            </Route>
            <Route path="/login">
              <Login auth={auth} />
            </Route>
            <Route path="/changePassword">
              <ChangePassword />
            </Route>
            <Route path="/chat" render={(props) => <Chat id={props.location.state?.id}/>}/>
            {/* <Route path="/chatTesting">
              <Chat />
            </Route>
            <Route path="/maptest">
              <MapTesting />
            </Route>*/}
            <Route path="/faq">
              <Faq />
            </Route>
            <Route path="/team">
              <Team />
            </Route>
            <Route path="/activate" children={<Activate />} />
            <Route path="/profile" children={<Profile auth={auth} />} />
            <Route path="/account" children={<Account auth={auth} />} />
            <Route path="*" render={() => { return (<Redirect to="/dashboard" />) }} />
          </Switch>
        </BrowserRouter>
      </Box>
      <Footer />
    </div>

  );
}
export default App;