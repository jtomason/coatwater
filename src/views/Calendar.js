import React, {useState, useEffect} from 'react'
import initialEvents from './events'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import Modal from '../components/Modal';
import moment from 'moment'

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
      display: 'block'
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

let Popup = ({  }) => {
  
  const [template, setTemplate] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [events, setEvents] = useState(initialEvents);
    const [formItem, setFormItem] = useState(null);
  
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
            <button className="my-primary" onClick={()=>{
              
              

              setEvents( pushToArray(events, formItem))
              setFormItem(null)

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