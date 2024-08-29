import { forwardRef } from 'react'
import { IInputField } from './IInputField'
import './InputField.css'

const InputField = forwardRef<HTMLInputElement, IInputField>(({label, icon, ...props}, ref) => {
        return (
            <div className='input-text'>
                {props.error && <span className='input-error-text'> { props.error.message } </span> }
                <div className='input-container'>
                    { icon }
                    <input autoComplete={"on"} id={ label } name={ label } ref={ ref } className={`input-field ${props.error?.message && 'input-error'}`} {...props}>
                    </input>
                </div>
            </div>
        )
    }
);

export default InputField;
