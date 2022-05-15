import { Box, Container, Stack, Link } from '@mui/material';
import React from 'react';

export default function Footer() {
    const [height, setHeight] = React.useState(window.innerHeight);
    React.useEffect(() => {
        function reportWindowSize() {
            if(height !== window.innerHeight){
                setHeight(window.innerHeight);
            }
        }
        window.addEventListener('resize', reportWindowSize);
    }, [height]);
    return (
        <footer hidden={height < 760}>
            <Box component="footer" sx={{
                color: "text.secondary",
                backgroundColor: "white",
                borderTop: "1px solid #C0C0C0",
                textAlign: "center",
                padding: "12px",
                position: "fixed",
                left: "0",
                bottom: "0",
                width: "100%",
                fontSize: 16
            }}
            >
                <Container maxWidth="sm">
                    <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
                        <Link href="info" color="inherit" underline="none">
                            Info
                        </Link>
                        <Link href="team" color="inherit" underline="none">
                            Zespół
                        </Link>
                        <Link href="https://aleks-2.mat.umk.pl/pz2021/zesp14/" target="_blank" color="inherit" underline="none">
                            Dokumentacja
                        </Link>
                    </Stack>
                </Container>
            </Box>
        </footer>
    );
}