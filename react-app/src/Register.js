import React, { useState } from 'react';
import './login.css'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

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
    <div>
    <h1>Rejestracja</h1>
    <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Label for="username">Login:</Label>
      <Input type="text" name="username" id="username" required onChange={e => setLogin(e.target.value)} placeholder="login" />
    </FormGroup>
    <FormGroup>
      <Label for="email">Email</Label>
      <Input type="email" name="email" id="email" required onChange={e => setEmail(e.target.value)} placeholder="email" />
    </FormGroup>
    <FormGroup>
      <Label for="password">Hasło</Label>
      <Input type="password" name="password" id="password" placeholder="hasło" onChange={e => setPassword(e.target.value)}/>
    </FormGroup>
    <FormGroup>
      <Label for="password">Powtórz hasło</Label>
      <Input type="password" name="passwordRepeat" id="passwordRepeat" placeholder="hasło" onChange={e => setPasswordRepeat(e.target.value)}/>
    </FormGroup>
    <Button color="primary" type='submit'>Zarejestruj</Button>
    <FormGroup>
      <p id="loginError">&nbsp;</p>
    </FormGroup>
    </Form>
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