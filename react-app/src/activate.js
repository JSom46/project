import React, { useState,useEffect } from 'react';
import './login.css'

import { CircularProgress } from '@mui/material';


async function activateAccount(userData) {
  const data = fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/activate', {
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
  const [activated,setActivated] = useState(0);

  useEffect(() => {
    let paramString = window.location.search;
    let searchParams = new URLSearchParams(paramString);
    const handleActivate = async e => {
      // e.preventDefault();
      var code = searchParams.get("code");
      const response = await activateAccount({
        code
      });
      console.log(response.msg);
      if(response.msg === 'account activated') setActivated(2);
      else if(response.msg === 'invalid code') setActivated(1);
    }
    handleActivate();
}, []);
if(activated === 2){
  setTimeout(()=>{window.location.href = '/login'},5000)
  return(
    <div>
      <h3 style={{color:"green"}}>Pomyślnie aktywowano konto</h3>
      <p>Nastąpi przekierowanie na stronę logowania...</p>
      </div>
    )
  }
  else if(activated === 1){
  return(
    <div>
     <h3 style={{color:"red"}}>To konto zostało już aktywowane lub kod aktywacyjny jest błędny.</h3>
     </div>
   )
  }
  else return(
    <div>
     <CircularProgress />
    </div>
   )
}