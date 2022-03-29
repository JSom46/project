import { Box, Container, Stack, Link, Typography } from '@mui/material';
import React from 'react';

export default function Footer() {
    return (
        <footer>
            <Box sx={{color: "text.primary", bgcolor: "text.secondary", padding:'20px'}}>
                <Container maxWidth="sm">
                    <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
                        <Link href="profile" color="inherit">
                            Test
                        </Link>
                        <Link href="profile" color="inherit">
                            Test2
                        </Link>
                    </Stack>
                </Container>
            </Box>
        </footer>
    );
}