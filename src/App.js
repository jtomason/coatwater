import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { withAuth } from '@okta/okta-react';
import { Security, ImplicitCallback } from '@okta/okta-react';
import {useRoutes} from 'hookrouter';
 

const config = {
  issuer: 'https://dev-206405.okta.com/oauth2/default',
  redirectUri: window.location.origin + '/implicit/callback',
  clientId: '0oa25ea3sb19JYhQT357',
  pkce: true
}

console.log(process.env.local, typeof process.env.local)
const baseAPIURL = process.env.local ? "https://localhost:5000" : "https://young-earth-90471.herokuapp.com";

const temp = baseAPIURL+'/get/five';

Notification.requestPermission().then(function(result) {
  console.log(result);
});


function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support system notifications");
    // This is not how you would really do things if they aren't supported. :)
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // Finally, if the user has denied notifications and you 
  // want to be respectful there is no need to bother them any more.
}

import React from "react";
const routes = {
  "/": () => <Home />,
  "/home": () => <Home />,
  "/login": () => <Login />
};

function App() {
  const routeResult = withAuth(useRoutes(routes))
  return routeResult
}

function Login() {
  return <div>What</div>
}

function Home() {

  const [info, setInfo] = useState(0);

  //
  useEffect(() => {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
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
        <button onClick={()=>{notifyMe()}}>Notify Me</button>
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
