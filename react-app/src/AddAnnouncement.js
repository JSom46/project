import React, { useState } from 'react';
import './login.css'
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { InputLabel, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Typography } from '@mui/material';
import {Select, MenuItem} from '@mui/material';

export default function AddAnnoucment() {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState('');
  const [pictures, setPictures] = useState();
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handlePictures = (event) => {
    const formData = new FormData();
        for(let i=0;i<event.target.files.length;i++){
            formData.append('pictures',event.target.files[i]);
        }
		setPictures(formData);
  };
  async function postAnnoucement() {
    // let data = {
    //   'json': JSON.stringify(credentials,files),
    //   'files': pictures
    // };
    const formData = new FormData();
    formData.append('title',title);
    formData.append('description',description);
    for (var value of pictures.values()) {
      formData.append('pictures',value);
    }
    formData.append('category',category);
    formData.append('lat',lat);
    formData.append('lng',lng);
      return fetch('http://localhost:2400/anons/add', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        credentials: 'include',
        body: formData
      })
        .then(data => data.json())
     }
  const handleSubmit = async e => {
    e.preventDefault();
    setLat(120.243);
    setLng(130.231);
    const response = await postAnnoucement();
    console.log(response.msg);
  }
  return(
    <div>
    <Typography variant="h4"> Dodaj ogłoszenie </Typography>
    <FormControl style={{width:500}}>
        <form /*onSubmit={handleSubmit}*/>
            <FormGroup>
                <TextField fullWidth={true} type='text' id="title" label="Tytuł" variant="standard" required onChange={e => setTitle(e.target.value)} />
                <FormControl variant="standard">
                    <InputLabel id="category">Rodzaj zgłoszenia</InputLabel>
                        <Select value={category} labelId="category" id="category" onChange={handleCategoryChange}>
                        <MenuItem value={0}>Zaginięcie</MenuItem>
                        <MenuItem value={1}>Znalezienie</MenuItem>
                        </Select>
                    <TextField fullWidth type='text' id="description" label="Opis" variant="standard" multiline minRows={5} required onChange={e => setDescription(e.target.value)} />
                    <br />
                    <Button variant="contained" component="label">Dodaj zdjęcia
                    <input type="file" accept='.jpg, .png' onChange={handlePictures} hidden multiple/> 
                    <p></p>
                    </Button>
                </FormControl>
            </FormGroup>
            <br />
            <Button variant="contained" /*type="submit"*/ onClick={handleSubmit}>Zgłoś</Button>
        </form>
    </FormControl>
    </div>
  )
}