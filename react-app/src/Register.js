import React, { useState } from 'react';
import './login.css'

async function registerUser(credentials) {
  console.log(credentials);
    return fetch('http://localhost:2400/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function Register() {
  const [login, setLogin] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordRepeat, setPasswordRepeat] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    if(password !== passwordRepeat){
        errorMessage("PASSWORDS_NOT_THE_SAME");
        return -1;
    }
    const response = await registerUser({
      login,
      email,
      password
    });
    errorMessage(response.msg);
  }

  return(
    <div className="login-wrapper">
      <h1>Rejestracja</h1>
      <form onSubmit={handleSubmit}>
          <label htmlFor="username">Login: </label><br />
          <input type="text" id="username" required onChange={e => setLogin(e.target.value)}/><br />
          <label htmlFor="email">Email: </label><br />
          <input type="email" id="email" required onChange={e => setEmail(e.target.value)}/><br />
          <label htmlFor="password">Hasło: </label><br />
          <input type="password" id="password" required onChange={e => setPassword(e.target.value)}/><br />
          <label htmlFor="password">Powtórz hasło: </label><br />
          <input type="password" id="passwordRepeat" required onChange={e => setPasswordRepeat(e.target.value)}/><br />
          <button type="submit">Zarejestruj</button>
      </form>
      <p id="registerMessage">&nbsp;</p>
    </div>
  )
  function errorMessage(code) {
      var element = document.getElementById("registerMessage");
      element.style.color = "red";
      switch(code){
          case "PASSWORDS_NOT_THE_SAME":
          element.innerHTML = "Hasła nie są takie same";
          break;
          case "SUCCESS":
          element.style.color = "green";
          element.innerHTML = "Pomyślnie założono konto\n";
          break;
          default:
          element.innerHTML = code;
      }
  }
}