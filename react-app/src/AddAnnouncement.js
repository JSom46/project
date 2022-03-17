import React, { useState, useEffect } from 'react';
import './login.css'

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { InputLabel, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';
import { Stack } from '@mui/material';

import MapPicker from './MapPicker';

function createTypes(name, coats, colors, breeds) {
  return { name, coats, colors, breeds };
}
export default function AddAnnoucment(props) {
  console.log('xd');
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState('');
  const [pictures, setPictures] = useState();
  const [picturesPreview, setPicturesPreview] = useState();
  const [type, setType] = useState('');
  const [coat, setCoat] = useState('');
  const [color, setColor] = useState('');
  const [breed, setBreed] = useState('');
  const [coats, setCoats] = useState([]);
  const [colors, setColors] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [types, setTypes] = useState();
  const [lat, setLat] = useState(); //Dane z mapy
  const [lng, setLng] = useState(); //Dane z mapy
  const [location, setLocation] = useState(null);

  function handleLocationChange(loc) {
    setLat(loc.lat);
    setLng(loc.lng);
    setLocation(loc);
  }
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleTypeChange = (event) => {
    setType(event.target.value);
    const choice = types.filter((type) => { return type.name === event.target.value });
    setCoat('');
    setColor('');
    setBreed('');
    setCoats(choice[0].coats);
    setColors(choice[0].colors);
    setBreeds(choice[0].breeds);
  };
  const handleCoatChange = (event) => {
    setCoat(event.target.value);
  };
  const handleColorChange = (event) => {
    setColor(event.target.value);
  };
  const handleBreedChange = (event) => {
    setBreed(event.target.value);
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
    formData.append('lat', lat); //Dane z mapy
    formData.append('lng', (((lng + 180) % 360 + 360) % 360) - 180); //Dane z mapy, znormalizowana dlugosc geog.
    formData.append('type', type); 
    formData.append('coat', coat); 
    formData.append('color', color); 
    formData.append('breed', breed); 
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
  useEffect(() => {
    const fetchTypes = async () => {
      let url = 'http://localhost:2400/anons/types';
      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        });
        const json = await response.json();
        const rows = [];
        json.forEach(element => {
          rows.push(createTypes(
            element.name,
            element.coats,
            element.colors,
            element.breeds
          ));
        });
        // const psycolors = rows.filter((type) => {return type.name === "Psy"});
        // console.log(psycolors[0].colors);
        setTypes(rows);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchTypes();
  }, []);

  return (
    <FormControl style={{ width: '100%' }} sx={{ padding: 2 }}>
      <form autoComplete='off'>
        <FormGroup>
          <TextField fullWidth={true} type='text' id="title" label="Tytuł" variant="standard" required onChange={handleTitleChange} />
          <FormControl variant="standard">
            <InputLabel id="category" required>Rodzaj zgłoszenia</InputLabel>
            <Select value={category} labelId="category" id="category" label="Kategoria" onChange={handleCategoryChange}>
              <MenuItem value={0}>Zaginięcie</MenuItem>
              <MenuItem value={1}>Znalezienie</MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth type='text' id="description" label="Opis" variant="standard" multiline minRows={4} required onBlur={handleDescriptionChange} />
          <FormControl variant="standard">
            <InputLabel id="type" required>Typ</InputLabel>
            <Select value={type} labelId="type" id="type" onChange={handleTypeChange}>
              {types && types.map((item) => (
                <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack justifyContent="space-evenly" direction="row" alignItems="center" spacing={2}>
            <FormControl variant="standard" style={{ width: '100%' }}>
              <InputLabel id="coat">Owłosienie</InputLabel>
              <Select value={coat} labelId="coat" id="coat" onChange={handleCoatChange} disabled={coats.length === 0}>
                {coats && coats.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="standard" style={{ width: '100%' }}>
              <InputLabel id="colors">Umaszczenie</InputLabel>
              <Select value={color} labelId="colors" id="colors" onChange={handleColorChange} disabled={colors.length === 0}>
                {colors && colors.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="standard" style={{ width: '100%' }}>
              <InputLabel id="breeds">Rasa</InputLabel>
              <Select value={breed} labelId="breeds" id="breeds" onChange={handleBreedChange} disabled={breeds.length === 0}>
                {breeds && breeds.map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <br />
          <MapPicker location={location} onLocationChange={handleLocationChange} />
          <br />
          <Button variant="contained" component="label">Dodaj zdjęcia
            <input type="file" accept='.jpg, .png' onChange={handlePictures} hidden multiple />
          </Button>
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
        <Button variant="contained" type="submit" onClick={handleSubmit} disabled={!props.disableSubmit}>Zgłoś</Button>
      </form>
    </FormControl>
  )
}