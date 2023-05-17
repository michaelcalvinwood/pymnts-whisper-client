import { Box, Button, Container, Heading, Input, Text } from '@chakra-ui/react';
import { set } from 'lodash';
import React, { useState } from 'react'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  return (
    <Container>
        <Heading size='sm' textAlign='center'>Login</Heading>
        <Box display="flex" alignItems={'center'} margin="1rem auto .5rem auto" width="fit-content" flexDirection={'column'}>
            <Text width="5rem;">Username</Text>
            <Input type="text" width="20rem" value={username} onChange={(e) => setUsername(e.target.value)}></Input>
        </Box>
        <Box display="flex" alignItems={'center'} margin="auto" width="fit-content" flexDirection={'column'}>
            <Text width="5rem;">Password</Text>
            <Input type="password" width="20rem" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
        </Box>
        <Button display='flex' margin='1rem auto' width={'fit-content'} >Submit</Button>
    </Container>
  )
}

export default Login