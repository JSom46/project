import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Team() {
    return (
        <Container maxWidth='600' sx={{mt: '50px'}}>
                    <Typography variant='h5' gutterBottom >
                        Zespół:
                    </Typography>
                    <Typography sx={{px: 4}}>
                    <li>Michał Dudkiewicz - opiekun zespołu<br /></li>
                    <li>Jan Sompoliński - kierownik zespołu, programista serwera<br /></li>
                    <li>Łukasz Halada - programista serwera<br /></li>
                    <li>Arkadiusz Kletkiewicz - sekretarz, programista aplikacji przeglądarkowej<br /></li>
                    <li>Bartosz Gryniaków - programista aplikacji przeglądarkowej<br /></li>
                    <li>Mateusz Wójciak - programista aplikacji mobilnej<br /></li>
                    <li>Mikołaj Poznański - programista aplikacji mobilnej<br /></li>
                    </Typography>
        </Container>
    );
}