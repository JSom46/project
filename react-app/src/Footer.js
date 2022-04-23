import { Box, Container, Stack, Link, Typography } from '@mui/material';
import React from 'react';

export default function Footer() {
    return (
        <footer>
            <Box sx={{color: "text.primary", bgcolor: "text.secondary", padding:'20px'}}>
                <Container maxWidth="sm">
                    <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
                        <Link href="faq" color="inherit">
                            FAQ
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