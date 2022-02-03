import React, { useState } from 'react';
import { BrowserRouter,Switch, Route, useParams } from 'react-router-dom';
import './login.css'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';


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

 function ProfilePage() {
   let { userId } = useParams();
   console.log(userId);
 }
export default function Activate() {
  const [email, setEmail] = useState();
  const [code, setCode] = useState();

  let { id } = useParams();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await activateAccount({
      email,
      code
    });
    errorMessage(response.msg);
  }
  return(
    <div>
    <h1>Aktywacja</h1>
    <p>id: {id}</p>
    {/* <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Label for="email">Email</Label>
      <Input type="email" name="email" id="email" required onChange={e => setEmail(e.target.value)} placeholder="email" />
    </FormGroup>
    <FormGroup>
      <Label for="code">Kod</Label>
      <Input type="number" name="code" id="code" placeholder="kod" onChange={e => setCode(e.target.value)}/>
    </FormGroup>
    </Form>
    <Button color="primary" type='submit' onClick={handleSubmit}>Aktywuj</Button>
    <FormGroup>
      <p id="activateError">&nbsp;</p>
    </FormGroup> */}
    </div>
  )
  function errorMessage(msg) {
      var element = document.getElementById("activateError");
      element.style.color = "red";
      element.innerHTML = msg;
  }
}