import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-spa";
import history from "./utils/history";

console.log('env', process.env.NODE_ENV);
console.log(process.env);
require('dotenv').config()
console.log('env', process.env.NODE_ENV);
console.log(process.env);

let domain, client_id, audience;
if(process.env.NODE_ENV!=='local'){
  domain = process.env.REACT_APP_AUTH_DOMAIN;
  client_id = process.env.REACT_APP_AUTH_CLIENT_ID;
  audience = process.env.REACT_APP_AUDIENCE;
}else{
  let config = require("./auth_config.json");
  domain = config.domain;
  client_id = config.clientId;
  audience = config.REACT_APP_AUDIENCE;
  console.log("GOT CONFIG FILE", domain, client_id)
}

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    client_id={client_id}
    audience={audience}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
