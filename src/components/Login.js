import { Alert, AlertIcon, Box, Button, Container, Heading, Input, Text } from '@chakra-ui/react';
import axios from 'axios';
import { set } from 'lodash';
import React, { useState } from 'react'
import * as wp from '../utils/wordpress';

function Login({username, setUsername, password, setPassword, setIsLoggedIn}) {
   
    const [alertMessage, setAlertMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState('error');

    const handleSubmit = async e => {
        const token = await wp.getJWT(username, password, 'delta.pymnts.com');
        console.log('token', token);
        
        if (token === false) return setAlertMessage('Invalid credentials.');
            
        setIsLoggedIn(true);
    }

  return (
    <Container>
        <Heading textAlign='center'>PYMNTS Whisper</Heading>
        <Alert status={alertStatus} marginBottom={'0'} visibility={alertStatus && alertMessage ? 'visible' : 'hidden'}>
          <AlertIcon />
          {alertMessage}
      </Alert>
        <Box display="flex" alignItems={'center'} margin=".5rem auto .5rem auto" width="fit-content" flexDirection={'column'}>
            <Text width="5rem;">Username</Text>
            <Input type="text" width="20rem" value={username} onChange={(e) => {
                setAlertMessage('');
                setUsername(e.target.value);
            }}></Input>
        </Box>
        <Box display="flex" alignItems={'center'} margin="auto" width="fit-content" flexDirection={'column'}>
            <Text width="5rem;">Password</Text>
            <Input type="password" width="20rem" value={password} onChange={(e) => {
                setAlertMessage('');
                setPassword(e.target.value);
            }}></Input>
        </Box>
        <Button display='flex' margin='1rem auto' width={'fit-content'} onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}

export default Login