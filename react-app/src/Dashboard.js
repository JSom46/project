import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Anons from './Anons';

export default function Dashboard(props) {
  return(
    <BrowserRouter>
      <Anons auth={props.auth}/>
    </BrowserRouter>
  );
}