import React, {useState} from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import AddAnnoucment from './AddAnnouncement';
import AnnoucementList from './AnnoucementList';
import {Collapse} from '@mui/material';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';

import Stack from '@mui/material/Stack';
// import Item from '@mui/material/ListItem';

export default function Anons(props) {
  // const [addAnnoucmentShown, setAddAnnoucmentShown] = React.useState(false);
  // const handleButtonClick = () => {
  //   setAddAnnoucmentShown((prev) => !prev);
  // };
  const [checked, setChecked] = useState(false);
  
  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return(
    <BrowserRouter>
      <Stack justifyItems="center" spacing={2}>
          <Tooltip title={props.auth?.login ? "" : "Tylko zalogowani użytkownicy mogą dodawać ogłoszenia"}>
            <span style={{width:'fit-content'}}>
             <Button variant={checked ? "outlined" : "contained"} onClick={handleChange} disabled={props.auth?.login ? false : true} >Dodaj ogłoszenie</Button>
            </span>
          </Tooltip>
          <Collapse in={checked}><AddAnnoucment /></Collapse>
          <AnnoucementList />
      </Stack>
    </BrowserRouter>
    );
  }