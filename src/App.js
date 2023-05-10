import logo from './logo.svg';
import { io } from 'socket.io-client';
import './App.css';
import { Alert, AlertIcon, Box, Button, Container, Heading, Input, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import InputSpeaker from './components/InputSpeaker';

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('error');
  const [showSpinner, setShowSpinner] = useState(false);
  const [url, setUrl] = useState('');
  const [speakers, _setSpeakers] = useState([]);
  const [transcript, _setTranscript] = useState('');
  const [article, _setArticle] = useState();

  console.log('App', speakers);

  const setTranscript = transcript => _setTranscript(transcript);
  const setArticle = article => _setArticle(article);
  const setSpeakers = speakers => _setSpeakers(speakers);
  
  const updateSpeaker = (num, name) => {
    let curSpeakers = speakers;
    curSpeakers[num] = name;
    setSpeakers(curSpeakers);
  }

  const message = (msg, status) => {
    setAlertMessage(msg);
    setAlertStatus(status);
  }

  const handleUrl = e => {

    if (url !== e.target.value) setUrl(e.target.value);
    
    if (e.target.value) window.socketConnection.emit('url', e.target.value);
    else message('', 'success');
  }

  const turnOffSpinner = () => setShowSpinner(false);
  const turnOnSpinner = () => setShowSpinner(true);

  if (!window.socketConnection) {
    window.socketConnection = io(`https://node.pymnts.com:6400`);
    
    window.socketConnection.on('transcript', transcript => setTranscript(transcript.replaceAll("\n", "<br>")))

    window.socketConnection.on('speakers', (speakers) => {
      console.log('speakers', speakers);
      setSpeakers(speakers);    
    });

    window.socketConnection.on('done', (msg) => {
      turnOffSpinner();
      message('', 'success');
    })

    window.socketConnection.on('message', (msg) => {
      message(msg, 'success');
      turnOnSpinner();
    });

    window.socketConnection.on('error', (msg) => {
      message(msg, 'error')
      turnOffSpinner();
    });
  }


  useEffect(() => {
    //window.socketConnection.emit('url', 'the url')
  }, []) 

  return (
    <div className="App">
      <Heading>PYMNTS Whisper</Heading>
      <Container>
      <Alert status={alertStatus} marginBottom={'0'} visibility={alertStatus && alertMessage ? 'visible' : 'hidden'}>
          <AlertIcon />
          {alertMessage}
      </Alert>
      <Box margin='.5rem 0'>
        <Box display='flex' alignItems={'center'}>
          <Text width='8rem' >Video&nbsp;URL:&nbsp; </Text>
          <Input value={url} onChange={handleUrl}/>
        </Box>
        {speakers.map((speaker, index) => {
          return <InputSpeaker
            key={speaker}
            num={index}
            name={speaker}
            updateSpeaker={updateSpeaker}
          />
        })
        }
        {speakers.length && <Button display='block' margin='auto' width='fit-content' padding='.25rem .5rem'>Set Speakers</Button>}
      </Box>
      <Box>
        {transcript && <Heading size='sm'>{article ? "Article" : "Transcript"}</Heading> }
        {transcript && <Text textAlign="left" dangerouslySetInnerHTML={{__html: article ? article : transcript}}></Text> }
      </Box>
      </Container>
      {showSpinner && <Box height='100vh' width="100vw" position='fixed' top='0' left='0' display='flex' justifyContent={'center'} alignItems={'center'}>
        <Spinner size='xl' color='navy'/>
    </Box> }
    </div>
  );
}

export default App;
