import { Container, Heading } from '@chakra-ui/react';
import React, { useState } from 'react'

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  return (
    <Container>
        <Heading size='sm' textAlign='center'>Login</Heading>
    </Container>
  )
}

export default Login