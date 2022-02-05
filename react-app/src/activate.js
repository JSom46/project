import React, { useState,useEffect } from 'react';
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
  const [activated,setActivated] = useState(false);

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
      if(response.msg === 'account activated') setActivated(true);
    }
    handleActivate();
}, []);
if(activated === true){
  setTimeout(()=>{window.location.href = '/login'},5000)
  return(
    <div>
      <h3 style={{color:"green"}}>Pomyślnie aktywowano konto</h3>
      <p>Nastąpi przekierowanie na stronę logowania...</p>
      </div>
    )
  }
  else {
  return(
    <div>
     <h3 style={{color:"red"}}>To konto zostało już aktywowane lub kod aktywacyjny jest błędny.</h3>
     </div>
   )
  }
}