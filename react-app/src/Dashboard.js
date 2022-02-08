import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Anons from './Anons';

export default function Dashboard() {
  return(
    <BrowserRouter>
      <Anons />
    </BrowserRouter>
  );
}