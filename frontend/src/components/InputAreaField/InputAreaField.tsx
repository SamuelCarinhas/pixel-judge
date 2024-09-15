import { forwardRef } from 'react'
import './InputAreaField.css'
import { IInputAreaField } from './IInputAreaField';

const InputAreaField = forwardRef<HTMLTextAreaElement, IInputAreaField>(({label, icon, ...props}, ref) => {
        return (
            <div className='input-area'>
                { props.description && <label> { props.description } </label> }
                {props.error && <span className='input-error-text'> { props.error.message } </span> }
                <div className='input-container'>
                    { icon }
                    <textarea autoComplete={"on"} id={ label } name={ label } ref={ ref } className={`input-area-field ${props.error?.message && 'input-error'}`} {...props}>
                    </textarea>
                </div>
            </div>
        )
    }
);

export default InputAreaField;
