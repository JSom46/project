import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import { Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';

import MapPicker from './MapPicker';

export default function AnnouncementNotifications(props) {
    const [data] = useState(props.row);
    const [openImageDialog, setOpenImageDialog] = useState({ open: false });
    const handleImageClick = (image) => {
        setOpenImageDialog({
            open: true,
            src: image.target.src
        })
    }
    return (
        <TableContainer component={Paper}>
            {data.length !== 0 ? (
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Zdjęcie</TableCell>
                            <TableCell>Lokalizacja</TableCell>
                            <TableCell align="center">Data dodania</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data !== undefined && data.map((row) => (
                            <TableRow
                                key={row.create_date}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ width: "200px", height: "200px" }}>
                                    {row.image === null ? <Typography variant='caption'>Brak zdjęcia</Typography>
                                        :
                                        <img
                                            src={process.env.REACT_APP_SERVER_ROOT_URL + '/anons/photo?name=' + row.image}
                                            style={{ width: "300px", height: "300px", objectFit: "cover", cursor: "pointer" }}
                                            alt={row.anon_id}
                                            onClick={handleImageClick}>
                                        </img>}
                                </TableCell>
                                <TableCell ><MapPicker location={[row.lat, row.lng]} /></TableCell>
                                <TableCell sx={{ width: "150px", height: "100px" }} align="center">{row.create_date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <Stack alignItems="center" m={3}>
                    <Typography variant='caption'>Brak powiadomień</Typography>
                </Stack>
            )}
            <Dialog open={openImageDialog.open} onClose={() => (setOpenImageDialog((prev) => ({ open: false, src: prev.src })))} fullWidth>
                <img src={openImageDialog.src} alt='' key={openImageDialog.src} />
            </Dialog>
        </TableContainer>
    );
}