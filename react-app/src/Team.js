import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Team() {
    return (
        <Container maxWidth='600' sx={{mt: '50px'}}>
                    <Typography variant='h5' gutterBottom >
                        Zespół:
                    </Typography>
                    <Typography sx={{px: 4}}>
                    <li>Michał Dudkiewicz - opiekun zespołu<div><br /></div></li>
                    <li>Jan Sompoliński - kierownik zespołu, programista serwera<div><br /></div></li>
                    <li>Łukasz Halada - programista serwera<div><br /></div></li>
                    <li>Arkadiusz Kletkiewicz - sekretarz, programista aplikacji przeglądarkowej<div><br /></div></li>
                    <li>Bartosz Gryniaków - programista aplikacji przeglądarkowej<div><br /></div></li>
                    <li>Mateusz Wójciak - programista aplikacji mobilnej<div><br /></div></li>
                    <li>Mikołaj Poznański - programista aplikacji mobilnej<div><br /></div></li>
                    </Typography>
        </Container>
    );
}