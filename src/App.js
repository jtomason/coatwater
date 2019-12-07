import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
const temp = 'https://young-earth-90471.herokuapp.com/get/five';
function App() {

  const [info, setInfo] = useState(0);

  getInfo(setInfo)
  
  
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
          {info}
        </a>
      </header>
    </div>
  );
}

async function getInfo(setInfo){
  let results = await axios.get(temp)
  setInfo(results)
}

export default App;
