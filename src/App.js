import logo from './logo.svg';
import { io } from 'socket.io-client';
import './App.css';
import { Heading } from '@chakra-ui/react';

function App() {

  if (!window.socketConnection) window.socketConnection = io(`https://node.pymnts.com:6400`);
    


  

  return (
    <div className="App">
      <Heading>PYMNTS Whisper</Heading>
    </div>
  );
}

export default App;
