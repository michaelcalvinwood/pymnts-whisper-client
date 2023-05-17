import logo from './logo.svg';
import { io } from 'socket.io-client';
import './App.css';
import { Alert, AlertIcon, Box, Button, Container, Heading, Input, Spinner, Text, Textarea } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import InputSpeaker from './components/InputSpeaker';
import env from 'react-dotenv'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('error');
  const [showSpinner, setShowSpinner] = useState(false);
  const [url, setUrl] = useState('');
  const [speakers, _setSpeakers] = useState([]);
  const [transcript, _setTranscript] = useState('');
  const [article, _setArticle] = useState();
  const [articleComplete, _setArticleComplete] = useState(false);
  const [focus, setFocus] = useState(0);
  const [rawTranscript, _setRawTranscript] = useState('');
  const [entities, setEntities] = useState('');

  console.log('App', window.env, speakers);

  const setTranscript = transcript => _setTranscript(transcript);
  const setArticle = article => _setArticle(article);
  const setSpeakers = speakers => _setSpeakers([...speakers]);
  const setArticleComplete = status => _setArticleComplete(status);
  const setRawTranscript = rt => _setRawTranscript(rt);
  
  const updateSpeaker = (num, name) => {
    console.log('updateSpeaker', num, name);
    let curSpeakers = [...speakers];
    curSpeakers[num] = name;
    console.log('curSpeakers', curSpeakers);
    setFocus(num);
    _setSpeakers(curSpeakers);
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

  const solidifySpeakers = e => {
    window.socketConnection.emit('speakers', {rawTranscript, speakerList: speakers});
  }

  const turnOffSpinner = () => setShowSpinner(false);
  const turnOnSpinner = () => setShowSpinner(true);

  if (!window.socketConnection) {
    window.socketConnection = io(`https://node.pymnts.com:6400`);
    
    window.socketConnection.on('rawTranscript', rt => setRawTranscript(rt));

    window.socketConnection.on('transcript', transcript => {
      console.log('got transcript', transcript);
      setTranscript(transcript.replaceAll("\n", '<br>'));
    })

    window.socketConnection.on('article', articlePart => {
      console.log('got article part', articlePart);
      let parts = articlePart.split("\n");
      for (let i = 0; i < parts.length; ++i) if (parts[i]) parts[i] = `<p>${parts[i]}</p>`;
      console.log(parts);
      setArticle(article ? article + parts.join("\n") : parts.join("\n"));
    });

    window.socketConnection.on('speakers', (speakers) => {
      console.log('speakers', speakers);
      setSpeakers(speakers);    
    });

    window.socketConnection.on('gotSpeakers', (msg) => {
      console.log('gotSpeakers');
      setSpeakers([])
    });

    window.socketConnection.on('done', (msg) => {
      if (msg === 'articleComplete') setArticleComplete(true);
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
            key={speaker + index}
            num={index}
            name={speaker}
            updateSpeaker={updateSpeaker}
            focus={index === focus}
          />
        })
        }
        {speakers.length !== 0 && <Textarea value={entities} onChange={e => setEntities(e.target.value)} placeholder={`List of names, products, etc. with unusual spelling.\nOne per line.`}  />}
        {speakers.length !== 0 && <Button display='block' margin='auto' width='fit-content' padding='.25rem .5rem' onClick={solidifySpeakers}>Set Speakers</Button>}
      </Box>
      <Box>
        <div id='transcriptArticle'>
          {transcript && <Heading size='sm'>{article ? "Article" : "Transcript"}</Heading> }
          {transcript && <Text textAlign="left" dangerouslySetInnerHTML={{__html: article ? article : transcript}}></Text> }
        </div>
      </Box>
      </Container>
      {showSpinner && <Box height='100vh' width="100vw" position='fixed' top='0' left='0' display='flex' justifyContent={'center'} alignItems={'center'}>
        <Spinner size='xl' color='navy'/>
    </Box> }
    </div>
  );
}

export default App;
