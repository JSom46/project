import { Box, Container, Stack, Link } from '@mui/material';
import React from 'react';

export default function Footer() {
    return (
        <footer>
            <Box component="footer" sx={{color: "text.primary", bgcolor: "lightblue", padding:'20px', mt:'auto'}}>
                <Container maxWidth="sm">
                    <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
                        <Link href="info" color="inherit">
                            Info
                        </Link>
                        <Link href="team" color="inherit">
                            Zespół
                        </Link>
                        <Link href="https://strona-zespolxiv.herokuapp.com/index.html" target="_blank" color="inherit">
                            Dokumentacja
                        </Link>
                    </Stack>
                </Container>
            </Box>
        </footer>
    );
}