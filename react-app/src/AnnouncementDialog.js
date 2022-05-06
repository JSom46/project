import React, { useState } from 'react';
// import {  } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, CircularProgress, Button, Grid } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { Divider } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';

import MapIcon from '@mui/icons-material/Map';
import ChatIcon from '@mui/icons-material/Chat';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

//import { Redirect, Link } from 'react-router-dom/cjs/react-router-dom.min';

import AddNotification from './AddNotification';
import MapSimple from './MapSimple';

import moment from 'moment';
import 'moment/locale/pl';

moment.locale('pl');

function GetDate(props) {
    if (props.date === undefined) return null;
    let date = moment.unix(props.date).format('MMMM Do YYYY, h:mm:ss a');
    return (
        <DialogContentText>
            {date}
        </DialogContentText>
    );
}

function ControlButtons(props) {
    if (props.isMy) {
        return (
            <DialogActions>
                <Button onClick={() => (props.setOpen(false))}>Wróć</Button>
                <Button color='warning' onClick={() => (props.setOpenEditDialog(true))}>Edytuj</Button>
                <Button color='error' onClick={() => (props.setOpenDeleteDialog(true))}>Usuń</Button>
                <Button onClick={() => (
                    window.location.href = "/dashboard?lat=" + props.announcementData.lat + "&lng=" + props.announcementData.lng
                )}>Pokaż na mapie</Button>
            </DialogActions>
        )
    }
    return (
        <DialogActions>
            <Button color='secondary' onClick={() => props.chatRedirect(props.announcementData.id)} endIcon={<ChatIcon/>} 
            disabled={parseInt(sessionStorage.getItem('user_id'))  === parseInt(props.announcementData.author_id)}>Czat</Button>
            <Button hidden={props.announcementData.category === 1} onClick={() => props.setOpenAddNotificationDialog(true)} endIcon={<AddLocationAltIcon />}>Widziałem to zwierzę</Button>
            <Button onClick={() => (props.showOnMap(props.announcementData.lat, props.announcementData.lng))} endIcon={<MapIcon/>}>Pokaż na mapie</Button>
            <Button onClick={() => (props.setOpen(false))}>Wróć</Button>
        </DialogActions>
    )
}

export default function AnnouncementDialog(props) {
    const [openImageDialog, setOpenImageDialog] = useState({ open: false });
    const [openAddNotifcationDialog, setOpenAddNotificationDialog] = useState(false);
    const [snackbarData, setSnackbarData] = React.useState({
        open: false,
        message: ""
    });
    const handleImageClick = (image) => {
        setOpenImageDialog({
            open: true,
            src: image.target.src
        })
    }
    const notificationCallback = (event) => {
        if (event.status === 200) {
            setSnackbarData({
                open: true,
                message: "Pomyślnie wysłano powiadomienie",
                severity: "success"
            });
        }
        else
            setSnackbarData({
                open: true,
                message: "Wystąpił błąd",
                severity: "error"
            });
        setOpenAddNotificationDialog(false);
    }
    return (
        <div>
            <Dialog open={props.open} onClose={() => props.setOpen(false)} maxWidth="md" fullWidth={true}>
                {(props.announcementData === undefined || props.announcementData === null || props.announcementData.length === 0) ? (
                    <Stack alignItems="center" m={3}>
                        <CircularProgress />
                    </Stack>
                ) : (
                    <div>
                        <DialogTitle>{props.announcementData.title}</DialogTitle>
                        <DialogContent>
                            <Typography variant="subtitle1">Opis</Typography>
                            <DialogContentText>
                                {props.announcementData.description}
                            </DialogContentText>
                            <Divider />

                            <Grid container columns={16}>
                                <Grid item md={10} xs={16}>
                                    <Typography variant="subtitle1">Zdjęcia</Typography>
                                    {props.announcementData.images && props.announcementData.images.map((element) => (
                                        <img style={{ width: "100px", height: "100px", objectFit: "cover", margin: 4 }} src={process.env.REACT_APP_SERVER_ROOT_URL + '/anons/photo?name=' + element}
                                            alt={props.announcementData.title} key={element} onClick={handleImageClick} />
                                    ))}
                                </Grid>
                                <Grid item md={6} sm={8} xs={14} sx={{ pb: '10px' }}>
                                    <Typography variant="subtitle1">Lokacja</Typography>
                                    <MapSimple loc={[props.announcementData.lat, props.announcementData.lng]} />
                                </Grid>
                            </Grid>


                            <Divider />
                            <Stack justifyContent="space-between" direction="row" alignContent="center" spacing={2}>
                                <span>
                                    <Typography variant="subtitle1">Typ</Typography>
                                    <DialogContentText>
                                        {props.announcementData.type}
                                    </DialogContentText>
                                </span>
                                <span>
                                    <Typography variant="subtitle1">Rasa</Typography>
                                    <DialogContentText>
                                        {props.announcementData.breed}
                                    </DialogContentText>
                                </span>
                                <span>
                                    <Typography variant="subtitle1">Owłosienie</Typography>
                                    <DialogContentText>
                                        {props.announcementData.coat}
                                    </DialogContentText>
                                </span>
                                <span>
                                    <Typography variant="subtitle1">Umaszczenie</Typography>
                                    <DialogContentText>
                                        {props.announcementData.color}
                                    </DialogContentText>
                                </span>
                            </Stack>
                            <Divider />
                            <Typography variant="subtitle1">Data zgłoszenia</Typography>
                            <GetDate date={props.announcementData.create_date} />
                            <Divider />
                        </DialogContent>
                        <ControlButtons {...props} setOpenAddNotificationDialog={setOpenAddNotificationDialog}/>                        
                    </div>
                )}
            </Dialog>
            <Dialog open={openImageDialog.open} onClose={() => (setOpenImageDialog((prev) => ({ open: false, src: prev.src })))} fullWidth>
                <img src={openImageDialog.src} alt={props.announcementData.title} />
            </Dialog>
            <Dialog open={openAddNotifcationDialog} onClose={() => (setOpenAddNotificationDialog(false))} fullWidth>
                <DialogTitle>Wyślij powiadomienie</DialogTitle>
                <AddNotification announcementData={props.announcementData} addNotificationCallback={notificationCallback} />
            </Dialog>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={snackbarData.open}
                onClose={() => setSnackbarData({ open: false })}
                autoHideDuration={5000}
            >
                <Alert onClose={() => setSnackbarData({ open: false })} severity={snackbarData.severity} sx={{ width: '100%' }}>
                    {snackbarData.message}
                </Alert>
            </Snackbar>
            {/* <Redirect to="/chatTesting" /> */}
        </div>
    );
}