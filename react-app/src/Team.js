import React from 'react';
import { Container, Typography } from '@mui/material';

export default function Team() {
    return (
        <Container maxWidth='600' sx={{mt: '50px'}}>
                    <Typography variant='h5' gutterBottom >
                        Zespół:
                    </Typography>
                    <Typography>
                    Jan Sompoliński - serwer<br />
                    Łukasz Halada - serwer<br />
                    Arkadiusz Kletkiewicz - aplikacja przeglądarkowa<br />
                    Bartosz Gryniaków - aplikacja przeglądarkowa<br />
                    Mateusz Wójciak - aplikacja mobilna<br />
                    Mikołaj Poznański - aplikacja mobilna<br />
                    <br />
                    Opiekun: Michał Dudkiewicz
                    </Typography>
        </Container>
    );
}