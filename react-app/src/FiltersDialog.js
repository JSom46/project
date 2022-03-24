import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, Button, FormControl, FormGroup, InputLabel, Select, MenuItem, TextField} from '@mui/material';
import { Stack } from '@mui/material';

import MapPicker from './MapPicker';

/*
    TODO better way to clear single filter, without clearing all of them
*/

function createFilters(_category, _type, _coat, _color, _breed, _location, _rad) {
    if (_location === null ||
        _location === undefined ||
        _location.lat === undefined ||
        _location.lng === undefined ||
        isNaN(_location.lat) ||
        isNaN(_location.lng)) {
        _location = null;
    }
    if (isNaN(_rad) || _rad <= 0) {
        _rad = -1;
    } 
    return {
        category: _category,
        type: _type,
        coat: _coat,
        color: _color,
        breed: _breed,
        location: _location,
        rad: _rad
    }
}

function createTypes(name, coats, colors, breeds) {
    return { name, coats, colors, breeds };
}

export default function FiltersDialog(props) {
    const [filters, setFilters] = useState(props.filters);
    const [category, setCategory] = useState(filters.category);
    const [type, setType] = useState(filters.type);
    const [coat, setCoat] = useState(filters.coat);
    const [color, setColor] = useState(filters.color);
    const [breed, setBreed] = useState(filters.breed);
    const [location, setLocation] = useState(filters.location);
    const [rad, setRad] = useState(filters.rad);

    const [locateMe, setLocateMe] = useState(0);

    const [typesData, setTypesData] = useState([]);
    const [coatsData, setCoatsData] = useState([]);
    const [colorsData, setColorsData] = useState([]);
    const [breedsData, setBreedsData] = useState([]);

    /*
    category
    type
    coat
    color
    breed
    location (lat, lng)
    rad
    */

    function handleSubmit() {
        const newFilters = createFilters(category, type, coat, color, breed, location, rad);
        setFilters(newFilters);
        console.log(newFilters);
        props.handleAccept(newFilters);
        props.setOpen(false);
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
        setCoat('');
        setBreed('');
        setColor('');
        const choice = typesData.filter((type) => { return type.name === event.target.value });
        setCoatsData(choice[0].coats);
        setColorsData(choice[0].colors);
        setBreedsData(choice[0].breeds);
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

    function handleLocationChange(loc) {
        //setLat(loc.lat);
        //setLng(loc.lng);
        setLocation(loc);
    }

    const handleRadChange = (event) => {
        setRad(event.target.value);
    };

    function clearCategory() {
        setCategory(-1);
    }

    function clearType() {
        setType('');
    }

    function clearCoat() {
        setCoat('');
    }

    function clearColor() {
        setColor('');
    }

    function clearBreed() {
        setBreed('');
    }

    function clearLocation() {
        setLocation(null);
    }

    function clearRad() {
        setRad(-1);
    }

    function clearAll() {
        clearCategory();
        clearType();
        clearCoat();
        clearColor();
        clearBreed();
        clearLocation();
        clearRad();
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
                setTypesData(rows);
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchTypes();
    }, [0]);

    return (
        <div>
            <Dialog open={props.open} onClose={() => props.setOpen(false)} fullWidth={true}>
                <DialogTitle>Filtruj ogłoszenia</DialogTitle>
                <FormControl style={{ width: '100%' }} sx={{ padding: 2 }}>
                    <FormGroup>
                        <FormControl variant="standard">
                            <InputLabel id="category">Rodzaj zgłoszenia</InputLabel>
                            <Select value={(category != -1) ? category : ''} labelId="category" id="category" label="Kategoria" onChange={handleCategoryChange}>
                                <MenuItem value={0}>Zaginięcie</MenuItem>
                                <MenuItem value={1}>Znalezienie</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard">
                            <InputLabel id="type">Typ</InputLabel>
                            <Select value={type} labelId="type" id="type" onChange={handleTypeChange} >
                                {(typesData.map((item) => (
                                    <MenuItem key={item.name} value={item.name}>{item.name}</MenuItem>
                                )))}
                            </Select>
                        </FormControl>
                        <Stack justifyContent="space-evenly" direction="row" alignItems="center" spacing={2}>
                            <FormControl variant="standard" style={{ width: '100%' }}>
                                <InputLabel id="coat">Owłosienie</InputLabel>
                                <Select value={coat} labelId="coat" id="coat" onChange={handleCoatChange} disabled={coatsData.length === 0}>
                                    {coatsData.map((item) => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" style={{ width: '100%' }}>
                                <InputLabel id="colors">Umaszczenie</InputLabel>
                                <Select value={color} labelId="colors" id="colors" onChange={handleColorChange} disabled={colorsData.length === 0}>
                                    {colorsData.map((item) => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" style={{ width: '100%' }}>
                                <InputLabel id="breeds">Rasa</InputLabel>
                                <Select value={breed} labelId="breeds" id="breeds" onChange={handleBreedChange} disabled={breedsData.length === 0}>
                                    {breedsData.map((item) => (
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <MapPicker location={location} onLocationChange={handleLocationChange} locateMe={locateMe} />
                        <TextField value={(rad > 0) ? rad : ''} fullWidth={true} type='number' id="rad" label="Odległość (km), domyślnie 30km" variant="standard" onChange={handleRadChange} />

                    </FormGroup>
                    <br /><br />
                    <FormGroup>
                        <Button variant="contained" type="submit" onClick={clearAll}>Wyczyść</Button>
                        <Button variant="contained" type="submit" onClick={handleSubmit}>Zapisz</Button>
                    </FormGroup>
                </FormControl>
            </Dialog>
        </div>
    );
}