import logo from './logo.svg';
import { io } from 'socket.io-client';
import './App.css';
import { Alert, AlertIcon, Container, Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('error');

  const message = (msg, status) => {
    setAlertMessage(msg);
    setAlertStatus(status);
  }

  if (!window.socketConnection) {
    window.socketConnection = io(`https://node.pymnts.com:6400`);
    
    window.socketConnection.on('message', (msg) => message(msg, 'success'));
    window.socketConnection.on('error', (msg) => message(msg, 'error'));
  }


  useEffect(() => {
    window.socketConnection.emit('url', 'the url')
  }, []) 

  return (
    <div className="App">
      <Heading>PYMNTS Whisper</Heading>
      <Container>
      <Alert status={alertStatus} marginBottom={'0'} visibility={alertStatus && alertMessage ? 'visible' : 'hidden'}>
          <AlertIcon />
          {alertMessage}
      </Alert>
      </Container>
    </div>
  );
}

export default App;
