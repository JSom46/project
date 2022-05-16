import React, { useState, useEffect } from 'react';


import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import { InputLabel, TextField } from '@mui/material';
import { Button } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';
import Tooltip from '@mui/material/Tooltip';
import { Stack } from '@mui/material';
import { Collapse, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

import MapPicker from './MapPicker';

function createTypes(name, coats, colors, breeds) {
  if (coats.length > 0) coats.unshift("");
  if (colors.length > 0) colors.unshift("");
  if (breeds.length > 0) breeds.unshift("");
  return { name, coats, colors, breeds };
}

export default function AddAnnoucment(props) {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState('');
  const [pictures, setPictures] = useState(new FormData());
  const [picturesPreview, setPicturesPreview] = useState([]);
  const [picturesCount, setPicturesCount] = useState(0);
  const [updatePicturesPreview, setUpdatePicturesPreview] = useState(0);
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
  const [alertData, setAlertData] = useState({
    open: false,
    variant: 'filled',
    severity: 'error',
    text: ''
  });
  const [loading, setLoading] = useState(false);

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

  //update pictures preview
  useEffect(() => {
    if (pictures === undefined || pictures === null) return;
    const picturesPreviewArray = [];

    for (let item of pictures.entries()) {
      picturesPreviewArray.push({
        id: item[0],
        img: URL.createObjectURL(item[1]),
      });
    }
    setPicturesPreview(picturesPreviewArray);
  }, [updatePicturesPreview]);

  function removePicture(id) {
    if (id >= 0 && id < picturesCount && pictures !== null && pictures !== undefined) {
      let kformData = pictures;

      kformData.delete(id);

      setPictures(kformData);
    }
    setUpdatePicturesPreview(updatePicturesPreview + 1);
  }

  function checkPicture(img, kformData) {
    if (pictures === undefined || pictures === null) return true;
    let len = 0;
    for (let item of kformData) {
      len++;
    }
    if (len >= 8) {
      setAlertData({
        open: true,
        variant: 'filled',
        severity: 'error',
        text: 'Maksymalnie 8 zdjęć'
      })
      return false;
    }
    if (img.size > 4 * 1024 * 1024) {
      setAlertData({
        open: true,
        variant: 'filled',
        severity: 'error',
        text: 'Zdjęcie nie może przekraczać 4 MB'
      })
      return false;
    }
    return true;
  }

  const handlePictures = (event) => {
    setAlertData({ open: false });

    let kformData = pictures;
    if (kformData === null || kformData === undefined) kformData = new FormData();

    let picturesPreviewArray = picturesPreview;
    if (picturesPreviewArray === null || picturesPreviewArray === undefined) picturesPreviewArray = [];

    let len = event.target.files.length;

    for (let i = 0; i < len; i++) {
      if (checkPicture(event.target.files[i], kformData)) {
        kformData.append(i + picturesCount, event.target.files[i]);
      }
    }

    setPictures(kformData);
    setPicturesPreview(picturesPreviewArray);
    setPicturesCount(picturesCount + len);
    setUpdatePicturesPreview(updatePicturesPreview + 1);
  };

  function checkForm() {
    if (title === null || title === undefined || title === "") {
      setAlertData({
        open: true,
        variant: 'filled',
        severity: 'error',
        text: 'Tytuł jest wymagany'
      });
      return false;
    }
    if (title.length < 3) {
      setAlertData({
        open: true,
        variant: 'filled',
        severity: 'error',
        text: 'Tytuł powinien miec conajmniej 3 znaki'
      });
      return false;
    }
    if (category === null || category === undefined || (category !== 0 && category !== 1)) {
      setAlertData({
        open: true,
        variant: 'filled',
        severity: 'error',
        text: 'Wybierz kategorię ogłoszenia'
      });
      return false;
    }
    if (description === null || description === undefined || description === "") {
      setAlertData({
        open: true,
        variant: 'filled',
        severity: 'error',
        text: 'Opis jest wymagany'
      });
      return false;
    }
    if (type === null || type === undefined || type === "") {
      setAlertData({
        open: true,
        variant: 'filled',
        severity: 'error',
        text: 'Wybierz typ zwierzęcia'
      });
      return false;
    }
    if (lat === null || lat === undefined || isNaN(lat) || lat < -90 || lat > 90 ||
      lng === null || lng === undefined || isNaN(lng) || lng < -180 || lng > 180) {
        setAlertData({
          open: true,
          variant: 'filled',
          severity: 'error',
          text: 'Wybierz lokację'
        });
        return false;
    }
    return true;
  }

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
      const response = await fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/anons/', {
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
    if (checkForm()) {
      setLoading(true);
      await postAnnoucement();
      setLoading(false);
    }
  }

  //get types, breeds, etc.
  useEffect(() => {
    const fetchTypes = async () => {
      let url = process.env.REACT_APP_SERVER_ROOT_URL + '/anons/types';
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
        setTypes(rows);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchTypes();
  }, []);

  return (
    <Box component="form" autoComplete="off" sx={{ padding: 2, width: '100%' }}>
      <FormGroup>
        <TextField fullWidth type='text' id="title" label="Tytuł" variant="standard" required onBlur={handleTitleChange} />
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
        <div><br /></div>
        <MapPicker autoLocate={true} location={location} onLocationChange={handleLocationChange} />
        <div><br /></div>
        <Tooltip title="Maksymalnie 8 zdjęć. Maksymalnie 4MB na zdjęcie">
          <Button aria-describedby="imageUploadButton" variant="contained" component="label">Dodaj zdjęcia
            <input id="imageUploadButton" type="file" accept="image/*" onChange={handlePictures} hidden multiple />
          </Button>
        </Tooltip>
      </FormGroup>
      <Box sx={{ border: (picturesPreview.length !== 0 ? "1px solid" : ""), marginTop: 1, marginBottom: 1 }}>
        {(picturesPreview.length > 0 && picturesPreview.map((item) => (
          <ImageListItem key={item.id} sx={{ width: 100, height: 100, margin: 1 }}>
            <div>
              <img
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                src={item.img}
                alt={item.id}
                loading="lazy"
              />
              <IconButton
                aria-label="delete"
                key={item.id}
                onClick={() => { removePicture(item.id) }}
                variant="outlined"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 60,
                }}
              ><DeleteIcon /></IconButton>
            </div>
          </ImageListItem>
        )))}
      </Box>
      <FormGroup>
        <Collapse in={alertData.open}>
          <Alert
            variant={alertData.variant}
            severity={alertData.severity}
            action={
              <IconButton color="inherit" size="small" onClick={() => { setAlertData({ open: false }); }}>
                <CloseIcon fontSize="inherit" />
              </IconButton>
            } sx={{ mb: 2 }}>
            {alertData.text}
          </Alert>
        </Collapse>
      </FormGroup>
      <Button variant="contained" type="submit" onClick={handleSubmit} disabled={loading}>Zgłoś</Button>
    </Box>
  )
}