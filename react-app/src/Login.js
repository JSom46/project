import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
  return data;
 }


export default function Login({ setToken }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      email,
      password
    });
    console.log(response);
    if(response.msg === 'ok'){
      const check = {
        token: "LoggedIn"
      }
      setToken(check);
    }
    else{
        errorMessage(response.msg);
    }
  }
  async function LoggedinTest() {
    const data = await fetch('http://localhost:2400/auth/loggedin', {
      method: 'GET',
      credentials: 'include',
    });
    return await data.json();
  }
  const test = async e => {
    e.preventDefault();
    const response = await LoggedinTest();
    console.log(response);
  }
  return(
    <div className="login-wrapper">
      <h1>Logowanie</h1>
      <form onSubmit={handleSubmit}>
        <label for="email">Email: </label><br />
          <input type="email" id="email" required onChange={e => setEmail(e.target.value)}/><br />
          <label for="password">Hasło: </label><br />
          <input type="password" id="password" required onChange={e => setPassword(e.target.value)}/>
        <div>
          <button type="submit">Zaloguj</button>
        </div>
        <div>
        <button onClick={test}>LoggedInTest</button><br />
        </div>
      </form>
      <p id="loginError">&nbsp;</p>
    </div>
  )
  function errorMessage(msg) {
      var element = document.getElementById("loginError");
      element.style.color = "red";
      element.innerHTML = msg;
  }
}
Login.propTypes = {
    setToken: PropTypes.func.isRequired
  }