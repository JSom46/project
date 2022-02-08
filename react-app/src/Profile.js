import React from 'react';
import './login.css'

import { CircularProgress } from '@mui/material';

export default function Profile(props) {
if(props.auth?.login){
  return(
    <div>
      <h3>Jesteś zalogowany</h3>
      <p>tutaj kiedyś będzie profil</p>
      </div>
    )
  }
  else if(props.auth?.msg){
  return(
    <div>
     <h3>Nie jesteś zalogowany</h3>
     <p>tutaj kiedyś będzie profil</p>
     </div>
   )
  }
  else return(
    <div>
     <CircularProgress />
    </div>
   )
}