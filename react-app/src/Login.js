import React, { useState, /*useEffect*/ } from 'react';
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { TextField } from '@mui/material';
import { Button,IconButton } from '@mui/material';
import { Google,Facebook } from '@mui/icons-material';
import { Stack } from '@mui/material';
import  Item  from '@mui/material/ListItem';
import { Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';

import './login.css'


async function loginUser(userData) {
  const data = fetch('http://localhost:2400/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(userData)
}).then(data => data.json())
return await data;
}
function logout() {
  sessionStorage.removeItem('token');
  window.location.assign("/");
  fetch('http://localhost:2400/auth/logout', {
    credentials: 'include',
    method: 'GET',
  });
}
async function LoginGoogle() {
  const data = await fetch('http://localhost:2400/auth/google/url?type=web', {
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
  const data = await fetch('http://localhost:2400/auth/facebook/url?type=web', {
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

export default function Login(props) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      email,
      password
    });
    console.log(response);
    if(response.msg !== 'ok'){
      errorMessage(response.msg);
    }
    else window.location.reload();
  }
//   const [auth, setAuth] = useState("");
  
//   useEffect(() => {
    
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:2400/auth/loggedin', {
//         method: 'GET',
//         credentials: 'include'
//       });
//       const json = await response.json();
//       //console.log(json);
//       setAuth(json);
//     } catch (error) {
//       console.log("error", error);
//     }
//   };
//   fetchData();
// }, []);
if(props.auth?.login)
  return(
    <div>
    <h1>Zalogowany</h1>
    <h2>Login:{" "+props.auth.login}</h2>
    <div>
    <Button color="primary" onClick={logout}>Wyloguj</Button><br />
    </div>
    </div>
    )
  else if(props.auth?.msg) 
  return(
    <div>
    <Typography variant="h4"> Logowanie </Typography>
    <FormControl>
    <form onSubmit={handleSubmit}>
    <FormGroup>
    <TextField type='email' id="email" label="Email" variant="standard" required onChange={e => setEmail(e.target.value)} />
    <TextField type='password' id="password" label="Hasło" variant="standard" required onChange={e => setPassword(e.target.value)} />
    <br />
    <Button variant="contained" type="submit" onClick={handleSubmit}>Zaloguj</Button>
    </FormGroup>
    <Stack direction="row" spacing={0}>
    <Item><IconButton onClick={LoginGoogleFunc}> <Google /> </IconButton></Item>
    <Item><IconButton onClick={LoginFacebookFunc}> <Facebook /> </IconButton></Item>
    </Stack>
    </form>
    </FormControl>
    <p id="loginError">&nbsp;</p>
    </div>
    )
  else
    return(
      <div>
        <CircularProgress />
      </div>
    )
    function errorMessage(msg) {
      var element = document.getElementById("loginError");
      if(msg === 'invalid password'){
        var textfield = document.getElementById("password");
        textfield.setAttribute("error");
      }
      element.style.color = "red";
      element.innerHTML = msg;
    }
  }