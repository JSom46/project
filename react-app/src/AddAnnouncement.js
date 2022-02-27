import React, { useState } from 'react';
import './login.css'
// import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { InputLabel, TextField } from '@mui/material';
import { Button } from '@mui/material';
// import { Typography } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
// import ImageList from '@mui/material/ImageList';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';


export default function AddAnnoucment(props) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState('');
  const [pictures, setPictures] = useState();
  const [picturesPreview, setPicturesPreview] = useState();
  // const [lat, setLat] = useState(); //Dane z mapy
  // const [lng, setLng] = useState(); //Dane z mapy

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handlePictures = (event) => {
    const formData = new FormData();
    const picturesPreviewArray = [];
    for (let i = 0; i < event.target.files.length; i++) {
      picturesPreviewArray.push(URL.createObjectURL(event.target.files[i]));
      formData.append('pictures', event.target.files[i]);
    }
    setPictures(formData);
    setPicturesPreview(picturesPreviewArray);
    // console.log(picturesPreview);
  };
  async function postAnnoucement() {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    for (let value of pictures.values()) {
      formData.append('pictures', value);
    }
    formData.append('lat', Math.random()); //Dane z mapy
    formData.append('lng', Math.random()); //Dane z mapy
    try {
      const response = await fetch('http://localhost:2400/anons/', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const json = await response.json();
      props.parentCallback(json);
    } catch (error) {
      console.log("error", error);
    }
  }
  const handleSubmit = async e => {
    e.preventDefault();
    const response = await postAnnoucement();
    console.log(response);
  }
  return (
    <div>
      {/* <Typography variant="h4"> Dodaj ogłoszenie </Typography> */}
      <FormControl style={{ width: '100%' }} sx={{ padding: 2 }}>
        <form autoComplete='off' /*onSubmit={handleSubmit}*/>
          <FormGroup>
            <TextField fullWidth={true} type='text' id="title" label="Tytuł" variant="standard" required onChange={e => setTitle(e.target.value)} />
            <FormControl variant="standard">
              <InputLabel id="category" required>Rodzaj zgłoszenia</InputLabel>
              <Select value={category} labelId="category" id="category" onChange={handleCategoryChange}>
                <MenuItem value={0}>Zaginięcie</MenuItem>
                <MenuItem value={1}>Znalezienie</MenuItem>
              </Select>
              <TextField fullWidth type='text' id="description" label="Opis" variant="standard" multiline minRows={7} required onChange={e => setDescription(e.target.value)} />
              <br />
              <Button variant="contained" component="label">Dodaj zdjęcia
                <input type="file" accept='.jpg, .png' onChange={handlePictures} hidden multiple />
              </Button>
            </FormControl>
          </FormGroup>
          <Box sx={{ border: (picturesPreview ? "1px solid" : ""), marginTop: 1, marginBottom: 1 }}>
            {picturesPreview && picturesPreview.map((item) => (
              <ImageListItem key={Math.random()} sx={{ margin: 1 }}>
                <img
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  src={item}
                  alt={item}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </Box>
          <Button variant="contained" /*type="submit"*/ onClick={handleSubmit} disabled={!props.disableSubmit}>Zgłoś</Button>
        </form>
      </FormControl>
    </div>
  )
}