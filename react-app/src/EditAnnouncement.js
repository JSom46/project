import React, { useState, useEffect } from 'react';
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
import { Stack } from '@mui/material';

import MapPicker from './MapPicker';

function createTypes(name, coats, colors, breeds) {
    return { name, coats, colors, breeds };
}

export default function EditAnnoucment(props) {
    const [id] = useState(props.row.id);
    const [title, setTitle] = useState(props.row.title);
    const [description, setDescription] = useState(props.row.description);
    const [category, setCategory] = useState(props.row.category);
    const [pictures, setPictures] = useState(new FormData());
    const [picturesPreview, setPicturesPreview] = useState();
    const [type, setType] = useState(props.row.type ? props.row.type : '');
    const [coat, setCoat] = useState(props.row.coat ? props.row.coat : '');
    const [color, setColor] = useState(props.row.color ? props.row.color : '');
    const [breed, setBreed] = useState(props.row.breed ? props.row.breed : '');
    const [typesData, setTypesData] = useState({
        types: '',
        coats: '',
        colors: '',
        breeds: ''
    });
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
        setCoat('');
        setBreed('');
        setColor('');
        const choice = typesData.types.filter((type) => { return type.name === event.target.value });
        setTypesData((prev) => ({
            types: prev.types,
            coats: choice[0].coats,
            colors: choice[0].colors,
            breeds: choice[0].breeds
        }))
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
        const kformData = new FormData();
        const picturesPreviewArray = [];
        for (let i = 0; i < event.target.files.length; i++) {
            picturesPreviewArray.push(URL.createObjectURL(event.target.files[i]));
            kformData.append('pictures', event.target.files[i]);
        }
        setPictures(kformData);
        setPicturesPreview(picturesPreviewArray);
        // console.log(picturesPreview);
    };

    async function editAnnoucement() {
        const formData = new FormData();
        formData.append('id', id);
        for (let value of pictures.values()) {
            formData.append('pictures', value);
        }
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('lat', lat); //Dane z mapy
        formData.append('lng', (((lng + 180) % 360 + 360) % 360) - 180); //Dane z mapy, znormalizowana dlugosc geog.
        formData.append('type', type);
        formData.append('coat', coat);
        formData.append('color', color);
        formData.append('breed', breed);
        try {
            const response = await fetch('http://localhost:2400/anons/', {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });
            // console.log(response);
            props.parentCallback(response);
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        await editAnnoucement();
    }

    useEffect(() => {
        const fetchTypes = async (type) => {
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
                const choice = rows.filter((c) => { return c.name === type });
                setTypesData({
                    types: rows,
                    coats: choice[0].coats,
                    colors: choice[0].colors,
                    breeds: choice[0].breeds
                })
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchTypes(props.row.type);
    }, [props.row.type]);

    return (
        <FormControl style={{ width: '100%' }} sx={{ padding: 2 }}>
            <form autoComplete='off'>
                <FormGroup>
                    <TextField value={title} fullWidth={true} type='text' id="title" label="Tytuł" variant="standard" required onBlur={handleTitleChange} />
                    <FormControl variant="standard">
                        <InputLabel id="category" required>Rodzaj zgłoszenia</InputLabel>
                        <Select value={category} labelId="category" id="category" label="Kategoria" onChange={handleCategoryChange}>
                            <MenuItem value={0}>Zaginięcie</MenuItem>
                            <MenuItem value={1}>Znalezienie</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField value={description} type='text' id="description" label="Opis" variant="standard" multiline minRows={4} required onBlur={handleDescriptionChange} />
                    <FormControl variant="standard">
                        <InputLabel id="type" required>Typ</InputLabel>
                        <Select value={typesData.types ? type : ''} labelId="type" id="type" onChange={handleTypeChange} >
                            {type && typesData.types && typesData.types.map((item) => (
                                <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Stack justifyContent="space-evenly" direction="row" alignItems="center" spacing={2}>
                        <FormControl variant="standard" style={{ width: '100%' }}>
                            <InputLabel id="coat">Owłosienie</InputLabel>
                            <Select value={coat} labelId="coat" id="coat" onChange={handleCoatChange} disabled={typesData.coats.length === 0}>
                                {typesData.coats.length === 0 ?
                                    <MenuItem key={coat} value={coat}>{coat}</MenuItem>
                                    :
                                    typesData.coats.map((item) => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" style={{ width: '100%' }}>
                            <InputLabel id="colors">Umaszczenie</InputLabel>
                            <Select value={color} labelId="colors" id="colors" onChange={handleColorChange} disabled={typesData.colors.length === 0}>
                                {typesData.colors.length === 0 ?
                                    <MenuItem key={color} value={color}>{color}</MenuItem>
                                    :
                                    typesData.colors.map((item) => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" style={{ width: '100%' }}>
                            <InputLabel id="breeds">Rasa</InputLabel>
                            <Select value={breed} labelId="breeds" id="breeds" onChange={handleBreedChange} disabled={typesData.breeds.length === 0}>
                                {typesData.breeds.length === 0 ?
                                    <MenuItem key={breed} value={breed}>{breed}</MenuItem>
                                    :
                                    typesData.breeds.map((item) => (
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
                <Button variant="contained" type="submit" onClick={handleSubmit}>Zapisz</Button>
            </form>
        </FormControl>
    )
}