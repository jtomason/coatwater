import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
const temp = 'https://young-earth-90471.herokuapp.com/get/five';
function App() {

  const [info, setInfo] = useState(0);

  //
  useEffect(() => {
    getInfo(setInfo)
      console.log('mount it!');
  }, []); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

  
  
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
          {JSON.stringify(info)}
        </a>
      </header>
    </div>
  );
}

async function getInfo(setInfo){
  let results = await axios.get(temp)
  console.log(results)
  setInfo(results)
}

export default App;
