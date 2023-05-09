import logo from './logo.svg';
import './App.css';

function App() {
  
  setTimeout(() => {
    if (!window.socketConnection) window.socketConnection = io(`https://node.pymnts.com:6400`);
  }, 2000)

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
