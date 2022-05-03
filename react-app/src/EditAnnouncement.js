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

export default function EditAnnoucment(props) {
    const [id] = useState(props.row.id);
    const [title, setTitle] = useState(props.row.title);
    const [description, setDescription] = useState(props.row.description);
    const [category, setCategory] = useState(props.row.category);
    const [pictures, setPictures] = useState(null);
    const [picturesPreview, setPicturesPreview] = useState([]);
    const [picturesCount, setPicturesCount] = useState(0);
    const [updatePicturesPreview, setUpdatePicturesPreview] = useState(0);
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
    const [alertData, setAlertData] = useState({
        open: false,
        variant: 'filled',
        severity: 'error',
        text: ''
    });
    const [lat, setLat] = useState(props.row.lat); //Dane z mapy
    const [lng, setLng] = useState(props.row.lng); //Dane z mapy
    const [location, setLocation] = useState([props.row.lat, props.row.lng]);

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

    //get pictures
    useEffect(() => {
        if (props.row.images !== undefined && props.row.images !== null && props.row.images.length > 0 && pictures === null) {
            async function getPictures() {
                let kformData = new FormData();
                const images = props.row.images;
                for (let i = 0; i < images.length; i++) {
                    const imname = images[i];
                    if (imname !== null && imname !== undefined && imname.length > 3) {
                        let imtype = "image/";
                        let nameguess = imname.slice(imname.length - 3);
                        if (nameguess == "jpg") imtype += "jpeg";
                        else imtype += "png";
                        const response = await (fetch(process.env.REACT_APP_SERVER_ROOT_URL + imname));
                        const blob = await (response.blob());
                        const file = new File([blob], imname, { type: imtype });
                        kformData.append(i, file);
                    }
                }
                setPictures(kformData);
                setPicturesCount(images.length);
                setUpdatePicturesPreview(updatePicturesPreview + 1);
            }
            getPictures();
        }  
    }, [0]);

    //update pictures preview
    useEffect(() => {
        if (pictures === undefined || pictures === null) return;
        let picturesPreviewArray = [];

        for (let item of pictures.entries()) {
            picturesPreviewArray.push({
                id: item[0],
                img: URL.createObjectURL(item[1])
            });
        }
        setPicturesPreview(picturesPreviewArray);
    }, [updatePicturesPreview]);

    function removePicture(id) {
        if (id >= 0 && id < picturesCount && pictures !== null && pictures !== undefined) {
            let kformData = pictures;
            //const picturesPreviewArray = picturesPreview;

            kformData.delete(id);
            //picturesPreviewArray.splice(id, 1);
            /*for (let i = 0; i < picturesPreviewArray.length; i++) {
              if (picturesPreviewArray[i].id == id) {
                picturesPreviewArray.splice(i, 1);
              }
            }*/

            setPictures(kformData);
            //setPicturesPreview(picturesPreviewArray);
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

                /*picturesPreviewArray.push({
                  id: i + picturesCount,
                  img: URL.createObjectURL(event.target.files[i])
                });*/
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
            const response = await fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/anons/', {
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
        if (checkForm()) {
            await editAnnoucement();
        }        
    }

    useEffect(() => {
        const fetchTypes = async (type) => {
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
                    <TextField defaultValue={title} fullWidth={true} type='text' id="title" label="Tytuł" variant="standard" required onBlur={handleTitleChange} />
                    <FormControl variant="standard">
                        <InputLabel id="category" required>Rodzaj zgłoszenia</InputLabel>
                        <Select value={category} labelId="category" id="category" label="Kategoria" onChange={handleCategoryChange}>
                            <MenuItem value={0}>Zaginięcie</MenuItem>
                            <MenuItem value={1}>Znalezienie</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField defaultValue={description} type='text' id="description" label="Opis" variant="standard" multiline minRows={4} required onBlur={handleDescriptionChange} />
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
                <Box sx={{ border: (picturesPreview.length !== 0 ? "1px solid" : ""), marginTop: 1, marginBottom: 1 }}>
                    {(picturesPreview.length !== 0 && picturesPreview.map((item) => (
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
                <Button variant="contained" type="submit" onClick={handleSubmit}>Zapisz</Button>
            </form>
        </FormControl>
    )
}