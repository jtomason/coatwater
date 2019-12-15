// src/views/ExternalApi.js

import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-spa";
import Calender from './Calendar.js'


const CalendarPage = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [eventMessage, setEventMessage] = useState("");
  const { getTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();

      const response = await fetch("https://young-earth-90471.herokuapp.com/get/five", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  const callEvent = async () => {
    try {

      let dt = new Date()
      dt.setMinutes( dt.getMinutes() + 2 );   
      
      const response = await fetch("https://young-earth-90471.herokuapp.com/event/create", {
        method: 'POST',
        body: JSON.stringify({
          "path": "/notification",
          "postAt": dt.toISOString(),
          "data": {
              "message": "testing for the app"
          }
        })
      });

      const responseData = await response.json();

      setEventMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>External API</h1>
      <button onClick={callApi}>Ping API</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
      <br/>
      <button onClick={callEvent}>Ping Event</button>
      <code>{JSON.stringify(eventMessage, null, 2)}</code>
      <br/>
      <Calender></Calender>
    </>
  );
};

export default CalendarPage;