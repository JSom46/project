import React, { useState, useEffect } from 'react';
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

export default function Login() {
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
  
  const [auth, setAuth] = useState("");
  
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:2400/auth/loggedin', {
        method: 'GET',
        credentials: 'include'
      });
      const json = await response.json();
      // console.log(json);
      setAuth(json);
    } catch (error) {
      console.log("error", error);
    }
  };
  
  fetchData();
}, []);
if(auth?.login){
  return(
    <div className="login-wrapper">
    <h1>Zalogowany</h1>
    <h2>Login:{" "+auth.login}</h2>
    <div>
    <button onClick={logout}>Wyloguj</button><br />
    </div>
    </div>
    )
  }
  else return(
    <div className="login-wrapper">
    <h1>Logowanie</h1>
    <form onSubmit={handleSubmit}>
    <label htmlFor="email">Email: </label><br />
    <input type="email" id="email" required onChange={e => setEmail(e.target.value)}/><br />
    <label htmlFor="password">Hasło: </label><br />
    <input type="password" id="password" required onChange={e => setPassword(e.target.value)}/>
    <div>
    <button type="submit">Zaloguj</button>
    </div>
    </form>
    <p id="loginError">&nbsp;</p>
    <div>
    <button onClick={LoginGoogleFunc}>LogowanieGoogle</button><br />
    <button onClick={LoginFacebookFunc}>LogowanieFacebook</button><br />
    </div>
    </div>
    )
    function errorMessage(msg) {
      var element = document.getElementById("loginError");
      element.style.color = "red";
      element.innerHTML = msg;
    }
  }