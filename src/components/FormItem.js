import React, { useState } from "react";
import { DateTimePicker } from 'react-widgets'
import PropTypes from 'prop-types';
import Moment from 'moment'
import 'react-widgets/dist/css/react-widgets.css';
import momentLocalizer from 'react-widgets-moment';

import { SwatchesPicker } from 'react-color';
Moment.locale('en')
momentLocalizer()

const FormItem = (props) => {
    console.log(props.error)

    return <div className="form-item">
        
        <FormLabel {...props}>{props.title}</FormLabel>:
        <FormInput {...props}></FormInput>
        {props.error && props.error.error ? <FormError {...props}>{props.error.error}</FormError> : null}
    </div>
    

}

const FormInput = (props) => {
    if(props.type==='datetime'){
        let value = props.value;
        if(typeof value === 'string'){
            value = new Date(value)
        }
        return <div>
            <DateTimePicker {...props} value={value}></DateTimePicker>
        </div>
    }

    if(props.type==='color'){
        return <SwatchesPicker
        color={ props.value }
        onChangeComplete={ props.onChange }
        {...props}
      />
    }

    return <div>
        <input className="form-field" {...props}></input>
        
    </div>
}

const FormLabel = (props) => {
    return <label {...props} className="form-label">{props.children}</label>
}

const FormError = (props) => {
    return <label {...props} className="form-error">{props.children}</label>
}

FormItem.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    type: PropTypes.string.isRequired,
    hide: PropTypes.bool
};


export default FormItem;