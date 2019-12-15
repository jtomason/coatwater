import React, {useState, useEffect} from 'react'
import initialEvents from './events'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import Modal from '../components/Modal';
import moment from 'moment'
import { useAuth0 } from "../react-auth0-spa";

import 'react-big-calendar/lib/css/react-big-calendar.css'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import FormGenerator from '../components/FormGenerator';

const localizer = momentLocalizer(moment)

const eventStyleGetter = function(event, start, end, isSelected) {
  var backgroundColor = event.color && event.color.hex ? event.color.hex : '#F5F5F5';
  var style = {
      backgroundColor: backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',  
      ":hover": {
      
        textDecoration: 'underline',
        backgroundColor: "#ff0000",
        color: "#ffffff"
      }
  };
  return {
      style: style
  };
};

const layout = {
  rows:[
    {
      columns: [
        {
          fields: [
            {title:'Start', accessor:'start', type:'datetime'}
          ]
        },
        
        {
          fields: [
            {title:'End', accessor:'end', type:'datetime'}
          ]
        }
      ]
    },
    {
      columns: [
        { 
          fields:[
            {title:'Title', accessor:'title', type:'text'},
            {title:'Notification Time', accessor:'notificationDateTime', type:'datetime'}
          ]
        },
        {
          fields:[
            {title:'Color', accessor:'color', type:'color'}
          ]
        }
      ]
    }
    
  ]
}

const eventSchema = {
  title:{
    required:true,
    validate: function(item, accessor){
      if(item[accessor] && item[accessor].length<3){
        return {key:accessor, error: 'Invalid length'}
      }
    }
  }
}


const validateItem = (item, schema) => {
  let errors = {};
  for(let key in schema){
    let field = schema[key]
    console.log(field)
    if(field.required && !item[key]){
      console.log("WADSNT LONG ENOUGH")
      errors[key] = {key, error:'Required'};
    }
    if(field.validate){
      let fieldError = field.validate(item, key)
      if(fieldError){
        errors[key] = fieldError
      }
    }
  }
  return errors;
}


const templateLayout ={
  rows:[
    {
      columns: [
        {
          fields: [
            {title:'Start', accessor:'start', type:'time'}
          ]
        },
        
        {
          fields: [
            {title:'Hours', accessor:'hours', type:'number'}
          ]
        }
      ]
    },
    {
      columns: [
        { 
          fields:[
            {title:'Title', accessor:'title', type:'text'},
            {title:'Notification Time', accessor:'notificationDateTime', type:'time'}
          ]
        },
        {
          fields:[
            {title:'Color', accessor:'color', type:'color'}
          ]
        }
      ]
    }
    
  ]
}


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function pushToArray(arr, obj) {
  arr = [...arr] // copy it cause I dont feel like dealing with react bullcrap
  const index = arr.findIndex((e) => e.id === obj.id);

  if (index === -1) {
      arr.push(obj);
  } else {
      arr[index] = obj;
  }
  return arr;
}
function removeFromArray(arr, obj) {
  return arr.filter((element)=>{
    return element.id !== obj.id;
  });
}

async function getEventsFromAPI(getTokenSilently, setEvents){
  try {
    const token = await getTokenSilently();

    const response = await fetch("https://young-earth-90471.herokuapp.com/events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const responseData = await response.json();
    console.log(responseData)
    let events = JSON.parse(responseData.info)[0].events.events;
    console.log(events)
    if(events){

      setEvents(events);
    }
  } catch (error) {
    console.error(error);
  }
}

async function setEventsToAPI(getTokenSilently, events){
  try {
    const token = await getTokenSilently();

    const response = await fetch("https://young-earth-90471.herokuapp.com/events", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        events
      })
    });

    const responseData = await response.json();
    console.log(responseData)

  } catch (error) {
    console.error(error);
  }
}

let Popup = ({  }) => {

  const { getTokenSilently } = useAuth0();
  

  const [template, setTemplate] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [events, setEvents] = useState(initialEvents);
    const [formItem, setFormItem] = useState(null);

    
  useEffect(() => {
      getEventsFromAPI(getTokenSilently, setEvents);
  }, []); // passing an empty array as second argument triggers the callback in useEffect only after the initial render thus replicating `componentDidMount` lifecycle behaviour

  
    const handleSelect = ({ start, end }) => {
      
      setFormItem({start, end, notificationDateTime:start})
        
    }
    
    return <React.Fragment>
          <button onClick={()=>{setTemplate({})}}>Create Template</button>
          <Calendar
          popup
          selectable
          events={events}
          localizer={localizer}
          defaultDate={new Date(2015, 3, 1)}
          onSelectEvent={event => {setFormItem(event)}}
          onSelectSlot={handleSelect}
          eventPropGetter={(eventStyleGetter)}
        />
        <Modal show={formItem!==null}
          header='Event'
          onClose={()=>{setFormItem(null)}}>
            <div>From Template: <button>Meritus Night</button> <button>Meritus Day</button> <button>War Memorial Day</button></div>
            <FormGenerator 
            layout={layout}
            item={formItem} 
            onChange={(value, accessor)=>{
              let errors = validateItem(formItem, eventSchema);
              console.log(errors)
              setFormItem({id:uuidv4(),...formItem, [accessor]:value, __errors:errors})
            }}>

            </FormGenerator>
            
            <button className="my-alert" onClick={()=>{setFormItem(null)}}>
              Close
            </button>
            <button className="my-warning" onClick={()=>{
              setEvents( removeFromArray(events, formItem))
              setFormItem(null)
            }
            }>Delete</button>
            <button className="my-primary" onClick={()=>{
              const newEvents = pushToArray(events, formItem);
              setEvents(newEvents )
              setFormItem(null)
              setEventsToAPI(getTokenSilently, newEvents)
              
            }
            }>Submit</button>
        </Modal>
        
        <Modal show={template!==null}
          header="Template"
          onClose={()=>{setTemplate(null)}}>
            <FormGenerator 
            layout={templateLayout} 
            item={template} 
            onChange={(value, accessor)=>{
              setTemplate({id:uuidv4(),...template, [accessor]:value})
            }}>

            </FormGenerator>
            <button onClick={()=>{
              

              setTemplates( pushToArray(templates, template))
              setTemplate(null)

            }
            }>Submit</button>
        </Modal>
      
      </React.Fragment>
}

export default Popup