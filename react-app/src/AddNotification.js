import React, { useState } from 'react';


import FormGroup from '@mui/material/FormGroup';
import { Typography } from '@mui/material';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import ImageListItem from '@mui/material/ImageListItem';
import { Tooltip } from '@mui/material';
import { Collapse, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import MapPicker from './MapPicker';


export default function AddNotification(props) {
    const [anon_id] = useState(props.announcementData.id);
    const [pictures, setPictures] = useState(new FormData());
    const [picturesPreview, setPicturesPreview] = useState([]);
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
    const handlePictures = (event) => {
        if (event.target.files.size > 4 * 1024 * 1024) {
            setAlertData({
                open: true,
                variant: 'filled',
                severity: 'error',
                text: 'Zdjęcie nie spełnia wymogów'
            })
            setPictures(null);
            setPicturesPreview([]);
        }
        else {
            setAlertData({ open: false });
            const formData = new FormData();
            const picturesPreviewArray = [];
            for (let i = 0; i < event.target.files.length; i++) {
                picturesPreviewArray.push(URL.createObjectURL(event.target.files[i]));
                formData.append('pictures', event.target.files[i]);
            }
            setPictures(formData);
            setPicturesPreview(picturesPreviewArray);
        }
    };
    async function postNotification() {
        const formData = new FormData();
        formData.append('anon_id', anon_id);
        for (let value of pictures.values()) {
            formData.append('picture', value);
        }
        formData.append('lat', lat); //Dane z mapy
        formData.append('lng', (((lng + 180) % 360 + 360) % 360) - 180); //Dane z mapy, znormalizowana dlugosc geog.
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/anons/notifications', {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            props.addNotificationCallback(response);
        } catch (error) {
            console.log("error", error);
        }
    }
    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        await postNotification();
        setLoading(false);
    }

    return (
        <Box component="form" autoComplete="off" sx={{ padding: 2, width: '100%' }}>
            <FormGroup>
                <Typography variant='subtitle1'>Gdzie widziałeś to zwierzę?</Typography>
                <div><br /></div>
                <MapPicker location={location} onLocationChange={handleLocationChange} />
                <div><br /></div>
                <Tooltip title="Maksymalnie 4MB">
                    <Button aria-describedby="imageUploadButton" variant="contained" component="label">Dodaj zdjęcia
                        <input id="imageUploadButton" type="file" accept="image/*" onChange={handlePictures} hidden />
                    </Button>
                </Tooltip>
            </FormGroup>
            <Box sx={{ border: (picturesPreview.length !== 0 ? "1px solid" : ""), marginTop: 1, marginBottom: 1 }}>
                {(picturesPreview.length !== 0 && picturesPreview.map((item) => (
                    <ImageListItem key={Math.random()} sx={{ margin: 1 }}>
                        <img
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            src={item}
                            alt={item}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))) ||
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
                }
            </Box>
            <Button variant="contained" type="submit" onClick={handleSubmit} disabled={loading}>Wyślij</Button>
        </Box>
    )
}