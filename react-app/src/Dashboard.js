import React from 'react';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min';
import AnnoucementList from './AnnoucementList';

// import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Grid';
import Item from '@mui/material/ListItem';

import MapOverview from './MapOverview';


export default function Dashboard(props) {
  // const [addAnnoucmentShown, setAddAnnoucmentShown] = React.useState(false);
  // const handleButtonClick = () => {
  //   setAddAnnoucmentShown((prev) => !prev);
  // };
  return(
    <BrowserRouter>
    <Grid container spacing={2} columns={16}>
       <Grid item xs={11}>
         <Item><MapOverview /></Item>
      </Grid>
      <Grid item xs={5}>
        <AnnoucementList/>
          {/* <Tooltip title={props.auth?.login ? "" : "Tylko zalogowani użytkownicy mogą dodawać ogłoszenia"}>
            <span style={{width:'fit-content'}}>
             <Button variant={checked ? "outlined" : "contained"} onClick={handleChange} disabled={props.auth?.login ? false : true} >Dodaj ogłoszenie</Button>
            </span>
          </Tooltip>
          <Collapse in={checked}><AddAnnoucment /></Collapse> */}
      </Grid>
    </Grid>
    </BrowserRouter>
    );
  }