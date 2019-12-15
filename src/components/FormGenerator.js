import React, { useState } from "react";


import PropTypes from 'prop-types';
import FormItem from "./FormItem";

const FormRow = (props) => {

    return <div className="form-row">{props.children}</div>
}

const FormColumn = (props) => {

    return <div className="form-column">{props.children}</div>
}

const FormGenerator = (props) => {
    const rows = props.layout.rows;
    const item = props.item;

    return <div>
        {rows.map((row)=>{
            return <FormRow>{row.columns.map((column)=>{
                return <FormColumn>{column.fields.map((field)=>{
                    return <FormItem 
                    key={field.title}
                    title={field.title} 
                    value={item[field.accessor] || ""}
                    type={field.type} 
                    error={item.__errors && item.__errors[field.accessor] ? item.__errors[field.accessor] : null}
                    onChange={(event)=>{
                        if(field.type === 'datetime'){
                            props.onChange(event, field.accessor)
                        }else if (field.type === 'color'){
                            props.onChange(event, field.accessor)
                        }else{
                            props.onChange(event.target.value, field.accessor)
                        }
                    }}>
                    </FormItem>
                })}</FormColumn>
            })} </FormRow>
        })}
        
    </div>

}
FormGenerator.propTypes = {
    layout: PropTypes.object,
    item: PropTypes.object,
    onChange: PropTypes.func
};

export default FormGenerator;