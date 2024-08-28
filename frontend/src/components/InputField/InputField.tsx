import React, { useState } from 'react';
import { IInputField } from './IInputField'
import './InputField.css'

export default function InputField(props: IInputField) {

    const [value, setValue] = useState<string>("");

    function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
        props.setError("");
        setValue(e.target.value);
        props.value.current = e.target.value; 
    }

    return (
        <div className='input-text'>
            { props.error.length > 0 &&
                <span className='input-error-text'> { props.error } </span>
            }
            <div className='input-container'>
                { props.icon }
                <input value={value } className={`input-field ${props.error.length > 0 && 'input-error'}`} type={props.type || 'text'} placeholder={props.placeholder} onChange={ inputChange }>
                </input>
            </div>
        </div>
    )
}