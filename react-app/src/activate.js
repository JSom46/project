import React, { useState, useEffect } from 'react';


import { CircularProgress } from '@mui/material';
import { Stack } from '@mui/material';


async function activateAccount(userData) {
  const data = fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/auth/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(userData)
  });
  return data;
}
export default function Activate() {
  const [activated, setActivated] = useState(0);

  useEffect(() => {
    const handleActivate = async e => {
      let paramString = window.location.search;
      let searchParams = new URLSearchParams(paramString);
      var code = searchParams.get("code");
      const response = await activateAccount({
        code
      });
      // console.log(response);
      if (response.status === 200) setActivated(2);
      else setActivated(1);
    }
    handleActivate();
  }, []);
  if (activated === 2) {
    setTimeout(() => { window.location.href = '/login' }, 5000)
    return (
      <div>
        <Stack justifyContent="center" alignItems="center">
          <h3 style={{ color: "green" }}>Pomyślnie aktywowano konto</h3>
          <p>Nastąpi przekierowanie na stronę logowania...</p>
        </Stack>
      </div>
    )
  }
  else if (activated === 1) {
    return (
      <div>
        <Stack justifyContent="center" alignItems="center">
          <h3 style={{ color: "red" }}>To konto zostało już aktywowane lub kod aktywacyjny jest błędny.</h3>
        </Stack>
      </div>
    )
  }
  else return (
    <div>
      <Stack justifyContent="center" alignItems="center">
        <CircularProgress />
      </Stack>
    </div>
  )
}