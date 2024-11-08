import { forwardRef } from 'react'
import { IInputDate } from './IInputDate'
import './InputDate.css'

const InputDate = forwardRef<HTMLInputElement, IInputDate>(({label, ...props}, ref) => {
        return (
            <div className='input-date'>
                { props.description && <label> { props.description } </label> }
                {props.error && <span className='input-error-text'> { props.error.message } </span> }
                <div className='input-date-container'>
                    <input type="datetime-local" autoComplete={"on"} id={ label } name={ label } ref={ ref } className={`input-date-field ${props.error?.message && 'input-error'}`} {...props}>
                    </input>
                </div>
            </div>
        )
    }
);

export default InputDate;
