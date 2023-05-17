import { Alert, AlertIcon, Box, Button, Container, Heading, Input, Text } from '@chakra-ui/react';
import axios from 'axios';
import { set } from 'lodash';
import React, { useState } from 'react'

function Login({username, setUsername, password, setPassword, setIsLoggedIn}) {
   
    const [alertMessage, setAlertMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState('error');

    const handleSubmit = async e => {
        let request = {
            url: "https://delta.pymnts.com/wp-json/jwt-auth/v1/token",
            method: "POST",
            withCredentials: false,
            headers: {
                'Content-Type': 'application/json',
                'Accept': "*/*"
            },
            data: {
                username,
                password
            }
        }

        let response;
        try {
            response = await axios(request);
            setIsLoggedIn(true);
        } catch (err) {
            console.error(err);
            setAlertMessage('Invalid credentials.')
            return;
        }

        console.log(response.data);
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