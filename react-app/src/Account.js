import React from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import './login.css'
import { Box, maxWidth } from '@mui/system';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Typography, Button } from '@mui/material';
import { Stack } from '@mui/material';

import { CircularProgress } from '@mui/material';

export default function Account(props) {
  console.log(props);
  if (props.auth.msg === 'not logged in') return (<Redirect to="/login" />)
  return (
    <Box>
      <Card sx={{ minWidth: 275, maxWidth: 400}}>
        <CardContent>
          <Typography variant='h5' gutterBottom>
            {props.auth.login}
          </Typography>
          <Typography variant='h6' gutterBottom>
            {props.auth.email}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Zmień login</Button>
          <Button size="small">Zmień hasło</Button>
        </CardActions>
      </Card>
    </Box>
  )
}