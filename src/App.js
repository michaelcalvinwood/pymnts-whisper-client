import logo from './logo.svg';
import { io } from 'socket.io-client';
import './App.css';
import { Alert, AlertIcon, Box, Button, Container, Heading, Input, Link, Select, Spinner, Text, Textarea } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import InputSpeaker from './components/InputSpeaker';
import axios from 'axios';
import Login from './components/Login';
import {useDropzone} from 'react-dropzone'
import * as wp from './utils/wordpress';


function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('error');
  const [showSpinner, setShowSpinner] = useState(false);
  const [url, setUrl] = useState('');
  const [speakers, _setSpeakers] = useState([]);
  const [transcript, _setTranscript] = useState('');
  const [article, _setArticle] = useState(null);
  const [articleComplete, _setArticleComplete] = useState(false);
  const [focus, setFocus] = useState(0);
  const [rawTranscript, _setRawTranscript] = useState('');
  const [entities, setEntities] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [titles, setTitles] = useState([]);
  const [title, setTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [articleId, setArticleId] = useState(0);
  const [tags, setTags] = useState([]);

  const [showProgressBar, setShowProgessBar] = useState(false);

  const progressBarRef = useRef();

  const setTranscript = transcript => _setTranscript(transcript);
  const setArticle = article => _setArticle(article);
  const setSpeakers = speakers => _setSpeakers([...speakers]);
  const setArticleComplete = status => _setArticleComplete(status);
  const setRawTranscript = rt => _setRawTranscript(rt);

  
  const updateSpeaker = (num, name) => {
    
    let curSpeakers = [...speakers];
    curSpeakers[num] = name;
    
    setFocus(num);
    _setSpeakers(curSpeakers);
  }

  const message = (msg, status) => {
    setAlertMessage(msg);
    setAlertStatus(status);
  }

  const onDrop = useCallback( async acceptedFiles => {
    setShowProgessBar(true);
    progressBarRef.current.value=20;
    return;

    const uploadUrl = `https://node.pymnts.com:6400/uploadMp4?s=${encodeURIComponent(window.socketConnection.id)}`;
    
    setShowSpinner(true);
    const fd = new FormData();
    acceptedFiles.forEach(file =>fd.append('File[]',file));

    let request = {
        url: uploadUrl,
        method: 'post',
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' }
    }
    console.log(request);

    let response;
    try {
        response = await axios(request)
    } catch (err) {
      message('Could not upload file.', 'error');  
      console.error(err.response);
    }

    setShowSpinner(false);
    return;


  })
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
  

  const handleUrl = e => {

    if (url !== e.target.value) setUrl(e.target.value);
    
    if (e.target.value) window.socketConnection.emit('url', e.target.value);
    else message('', 'success');
  }

  const solidifySpeakers = e => {
    window.socketConnection.emit('speakers', {rawTranscript: transcript, speakerList: speakers, entities});
  }

  const makePost = async () => {
    let result = await wp.createPost('delta.pymnts.com', username, password, title, article.engagingArticle, tags);

    if (result === false) message("Could not create post", "error");
    else {
      message("Post created.");
      setArticleId(result);
    }
  }

  const turnOffSpinner = () => setShowSpinner(false);
  const turnOnSpinner = () => setShowSpinner(true);

  if (!window.socketConnection) {
    window.socketConnection = io(`https://node.pymnts.com:6400`);
    
    window.socketConnection.on('rawTranscript', rt => setTranscript(rt));

    window.socketConnection.on('finalTranscript', transcript => {
      console.log('got transcript', transcript);
      message('Writing the article. This can take several minutes.', 'success');
      setTranscript(transcript);
      turnOffSpinner();
    })

    window.socketConnection.on('article', article => {
      setArticle(article);
      console.log('engaging artile', article.engagingArticle);
      console.log('titleTags', article.titleTags);
      
      let titleTagsJson = article.titleTags.replaceAll("\n", "");
      let titleTags = JSON.parse(titleTagsJson);
      
      console.log('titles', titleTags.titles);
      setTitles(titleTags.titles);
      setTitle(titleTags.titles[0]);

      console.log('tags', titleTags.tags);
      setTags(titleTags.tags);

      setTranscript(article.engagingArticle);

      message('Article finished. You can copy it now.', 'success');

      // console.log('got article part', articlePart);
      // let parts = articlePart.split("\n");
      // for (let i = 0; i < parts.length; ++i) if (parts[i]) parts[i] = `<p>${parts[i]}</p>`;
      // console.log(parts);
      // setArticle(article ? article + parts.join("\n") : parts.join("\n"));
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

  if (isLoggedIn) {
    //wp.getTagId('delta.pymnts.com', username, password, 'PYMNTS Testomatic');
  }

  if (!isLoggedIn) {
    return <Login 
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      setIsLoggedIn={setIsLoggedIn}
    />
  }

  return (
    <div className="App">
      <Heading>PYMNTS Whisper</Heading>
      <Container>
      <Alert status={alertStatus} marginBottom={'0'} visibility={alertStatus && alertMessage ? 'visible' : 'hidden'}>
          <AlertIcon />
          {alertMessage}
      </Alert>
      <Box margin='.5rem 0'>
        { titles.length === 0 && !transcript && <Box display='flex' alignItems={'center'}>
            <Text width='8rem' >Video&nbsp;URL:&nbsp; </Text>
            <Input value={url} onChange={handleUrl}/>
          </Box>
        }

      { showProgressBar && <progress ref={progressBarRef} value={'0'} max='100' />

      }

      <Box marginTop="8px" height="96px" padding='.5rem' border='1px solid var(--chakra-colors-gray-200)' borderRadius='8px' cursor='pointer'>
          <div {...getRootProps()}>
              <input {...getInputProps()} />
              {
                  <p style={{height:'6rem', width:'100%'}}>&nbsp;Drag 'n' drop some files here, or click to select files</p>
              }
          </div>
      </Box>
      
        {titles.length > 0 && <Select placeholder='Select option' value={titleIndex.toString()} 
            onChange={e => { 
              console.log('titles change', e.target.value) 
              setTitleIndex(Number(e.target.value));
              setTitle(titles[Number(e.target.value)])
            }}>
          {titles.map((t, i) => {
            return <option key={`${t}-${i}`} value={`${i}`}>{t}</option>
          })}
          </Select>

        }
        {
          articleId !== 0 && <Link href={`https://pymnts.com/?p=${articleId}`} textDecoration={'none'}>
            <Button display='block' margin='auto' width="fit-content" padding=".25rem .5rem">View Article</Button>
          </Link>
        }
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
        {speakers.length !== 0 && <Textarea value={entities} 
          onChange={e => { 
            setEntities(e.target.value);
            setFocus(-1);
          }} 
          placeholder={`Optionally provide information here to assist AI with copyediting (such as where people work, unusual spellings, etc.)`}  
          />}
        {speakers.length !== 0 && <Button display='block' margin='.5rem auto' width='fit-content' padding='.25rem .5rem' onClick={solidifySpeakers}>Set Speakers</Button>}
        {article !== null && <Button display='block' margin='.5rem auto' width='fit-content' padding='.25rem .5rem' onClick={makePost}>Create Post</Button>}
      </Box>
      <Box>
        <div id='transcriptArticle'>
          {/* {transcript && <Heading size='sm'>{article ? "Article" : "Transcript"}</Heading> }
          {transcript && <Text textAlign="left" dangerouslySetInnerHTML={{__html: article ? article : transcript}}></Text> } */}
          {transcript && <Heading size='sm'>Transcript</Heading> }
          {transcript && <Textarea rows="25" textAlign="left" value={transcript} onChange={e => setTranscript(e.target.value)}/> }
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
