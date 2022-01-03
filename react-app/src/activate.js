import React, { useState } from 'react';
import './login.css'


async function activateAccount(userData) {
  const data = fetch('http://localhost:2400/auth/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(userData)
  }).then(data => data.json())
  return data;
 }


export default function Activate() {
  const [email, setEmail] = useState();
  const [code, setCode] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await activateAccount({
      email,
      code
    });
    errorMessage(response.msg);
  }

  return(
    <div className="login-wrapper">
      <h1>Aktywacja</h1>
      <form onSubmit={handleSubmit}>
        <label for="email">Email: </label><br />
          <input type="email" id="email" required onChange={e => setEmail(e.target.value)}/><br />
          <label for="code">Kod: </label><br />
          <input type="text" id="text" required onChange={e => setCode(e.target.value)}/>
        <div>
          <button type="submit">Aktywuj</button>
        </div>
        <div>
        {/* <button onClick={test}>LoggedInTest</button><br /> */}
        </div>
      </form>
      <p id="activateError">&nbsp;</p>
    </div>
  )
  function errorMessage(msg) {
      var element = document.getElementById("activateError");
      element.style.color = "red";
      element.innerHTML = msg;
  }
}