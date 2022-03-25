import React, {useState} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, CircularProgress, Button } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { Divider } from '@mui/material';

export default function AnnouncementDialog(props) {
    const [openImageDialog, setOpenImageDialog] = useState({ open: false });
    const handleImageClick = (image) => {
        setOpenImageDialog({
            open: true,
            src: image.target.src
        })
    }
    return (
        <div>
            <Dialog open={props.open} onClose={() => props.setOpen(false)} maxWidth="md" fullWidth={true}>
                {(props.announcementData === undefined || props.announcementData.length === 0) ? (
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
                            <Typography variant="subtitle1">Zdjęcia</Typography>
                            {props.announcementData.images && props.announcementData.images.map((element) => (
                                <img style={{ width: "100px", height: "100px", objectFit: "cover", margin: 4 }} src={'http://localhost:2400/anons/photo?name=' + element}
                                    alt={props.announcementData.title} key={props.announcementData.id} onClick={handleImageClick} />
                            ))}
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
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => (props.setOpen(false))}>Wróć</Button>
                            <Button onClick={() => (props.showOnMap(props.announcementData.lat, props.announcementData.lng))}>Pokaż na mapie</Button>
                        </DialogActions>
                    </div>
                )}
            </Dialog>
            <Dialog open={openImageDialog.open} onClose={() => (setOpenImageDialog((prev) => ({open:false, src:prev.src})))} fullWidth>
                <img src={openImageDialog.src} alt={props.title}/>
            </Dialog>
        </div>
    );
}