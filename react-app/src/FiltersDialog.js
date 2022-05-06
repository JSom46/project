import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { Stack } from '@mui/material';
import Grid from '@mui/material/Grid';

import MapPicker from './MapPicker';

/*
    TODO better way to clear single filter, without clearing all of them
*/

function createFilters(_category, _title, _type, _coat, _color, _breed, _location, _rad) {
    if (_location === null ||
        _location === undefined ||
        _location.lat === undefined ||
        _location.lng === undefined ||
        isNaN(_location.lat) ||
        isNaN(_location.lng)) {
        _location = null;
    }
    if (isNaN(_rad) || _rad <= 0) {
        _rad = 0;
    }
    return {
        category: _category,
        anonTitle: _title,
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
    const [anonTitle, setAnonTitle] = useState(filters.anonTitle);
    const [type, setType] = useState(filters.type);
    const [coat, setCoat] = useState(filters.coat);
    const [color, setColor] = useState(filters.color);
    const [breed, setBreed] = useState(filters.breed);
    const [location, setLocation] = useState(filters.location);
    const [rad, setRad] = useState(filters.rad);

    const [locateMe] = useState(0);

    const [typesData, setTypesData] = useState([]);
    const [coatsData, setCoatsData] = useState([]);
    const [colorsData, setColorsData] = useState([]);
    const [breedsData, setBreedsData] = useState([]);

    const [advancedOpen, setAdvancedOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);

    /*
    category
    title
    type
    coat
    color
    breed
    location (lat, lng)
    rad
    */

    function openLocationDialog() {
        setLocationOpen(true);
    }

    function openAdvancedDialog() {
        setAdvancedOpen(true);
    }

    function handleSubmit() {
        const newFilters = createFilters(category, anonTitle, type, coat, color, breed, location, rad);
        if (newFilters.location !== null) {
            //props.showOnMap(newFilters.location.lat, newFilters.location.lng);
            props.setShowDistance(true);
        }
        else {
            props.setShowDistance(false);
        }
        setFilters(newFilters);
        //console.log(newFilters);
        props.handleAccept(newFilters);
        props.setOpen(false);
    }

    function handleLocationSubmit() {
        setLocationOpen(false);
        handleSubmit();
    }

    function handleAdvancedSubmit() {
        setAdvancedOpen(false);
        handleSubmit();
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleTitleChange = (event) => {
        setAnonTitle(event.target.value);
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

    function clearAnonTitle() {
        setAnonTitle('');
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
        setRad('');
    }

    /*function clearRad() {
        setRad(-1);
    }*/

    function clearAdvanced() {
        clearType();
        clearCoat();
        clearColor();
        clearBreed();
    }

    function clearAll() {
        clearCategory();
        clearAnonTitle();
        clearType();
        clearCoat();
        clearColor();
        clearBreed();
        clearLocation();
        //clearRad();

        //handleSubmit();
    }

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
                setTypesData(rows);
            } catch (error) {
                console.log("error", error);
            }
        };
        fetchTypes();
    }, [0]);

    return (
        <div>
            <Grid container spacing={1} columns={16} alignItems="center" justifyContent="center">
                <Grid container item direction="column" sm={10} xs={16} >
                    <Grid>
                        <FormControl variant="standard" style={{ width: '100%' }}>
                            <InputLabel id="category">Rodzaj zgłoszenia</InputLabel>
                            <Select value={(category !== -1) ? category : ''} labelId="category" id="category" label="Kategoria" onChange={handleCategoryChange}>
                                <MenuItem value={0}>Zaginięcie</MenuItem>
                                <MenuItem value={1}>Znalezienie</MenuItem>
                            </Select>
                        </FormControl>
                        
                    </Grid>
                    <Grid item>
                        <Stack direction="row" spacing={1}>
                            <Button variant="text" type="submit" onClick={openLocationDialog}>Lokacja</Button>
                            <Button variant="text" type="submit" onClick={openAdvancedDialog}>Zaawansowane</Button>
                        </Stack>

                    </Grid>
                </Grid>
                <Grid container item sm={3} xs={8} >
                    <Button variant="contained" type="submit" onClick={clearAll}>Wyczyść</Button>
                </Grid>
                <Grid container item sm={3} xs={8} >
                    <Button variant="contained" type="submit" onClick={handleSubmit}>Filtruj</Button>
                </Grid>
            </Grid>
            <Dialog open={advancedOpen} onClose={() => setAdvancedOpen(false)} fullWidth={true}>
                <FormControl style={{ width: '100%' }} sx={{ padding: 2 }}>
                    <DialogTitle>Zaawansowane Wyszukiwanie</DialogTitle>
                    <FormControl variant="standard">
                        <TextField value={anonTitle} fullWidth type='text' id="title" label="Tytuł" variant="standard" onChange={handleTitleChange} />
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
                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ paddingTop: 2 }}>
                        <Button variant="contained" type="submit" onClick={clearAdvanced}>Wyczyść</Button>
                        <Button variant="contained" type="submit" onClick={handleAdvancedSubmit}>Zapisz</Button>
                    </Stack>
                </FormControl>
            </Dialog>
            <Dialog open={locationOpen} onClose={() => setLocationOpen(false)} fullWidth={true}>
                <DialogTitle>Wyszukiwanie po Lokacji</DialogTitle>
                <FormControl style={{ width: '100%' }} sx={{ padding: 2 }}>
                    <MapPicker autoLocate={true} location={location} onLocationChange={handleLocationChange} locateMe={locateMe} />
                    <TextField value={rad} fullWidth={true} type='number' id="rad" label="Odległość (km)" variant="standard" onChange={handleRadChange} />
                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ paddingTop: 2 }}>
                        <Button variant="contained" type="submit" onClick={clearLocation}>Wyczyść</Button>
                        <Button variant="contained" type="submit" onClick={handleLocationSubmit}>Zapisz</Button>
                    </Stack>
                </FormControl>
            </Dialog>
        </div >
    );
}