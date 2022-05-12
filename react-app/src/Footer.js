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
                color: "text.primary",
                backgroundColor: "lightblue",
                borderTop: "1px solid #E7E7E7",
                textAlign: "center",
                padding: "20px",
                position: "fixed",
                left: "0",
                bottom: "0",
                width: "100%",
            }}
            >
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