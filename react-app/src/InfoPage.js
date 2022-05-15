import { Container, Typography, Box } from '@mui/material';
import React from 'react';

export default function InfoPage() {
    return (
        <Container maxWidth="md">
            <Box m="auto" width={400} height={400}>
                <img src='./logo_transparent.png' alt='logo' width='400px' height='400px'/>
            </Box>
            
            <Typography variant='h2' align='center' ><b>ZwierzoZnajdźca</b><br/><br/></Typography>
            <Typography align='justify' >
                ZwierzoZnajdźca powstał, by ułatwić właścicielom zaginionych zwierząt ich znalezienie.
                <br /><br />
                Użytkownicy mogą dodawać ogłoszenia o zaginięciu zwierząt, wraz z informacjami o zwierzęciu, zdjęciami i informacją o miejscu w którym ostatnio mieli kontakt z pupilem.
                Inni użytkownicy mogą odpowiadać na takie ogłoszenia, zamieszczając zdjęcia i lokację w której widzieli zwierzę.
                <br /><br />
                Istnieje też mozliwość dodania ogłoszeń o znalezieniu zwierzęcia, które wygląda na zaginione - może ktoś go właśnie szuka?
            </Typography>
        </Container>
    );
}