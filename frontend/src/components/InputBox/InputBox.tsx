import { forwardRef } from 'react'
import './InputBox.css'
import { IInputBox } from './IInputBox';

const InputBox = forwardRef<HTMLInputElement, IInputBox>(({label, ...props}, ref) => {
        return (
            <div className='input-box-area'>
                { props.description && <label> { props.description } </label> }
                {props.error && <span className='error'> { props.error.message } </span> }
                <label className='input-box-container'>
                    <input type='checkbox' autoComplete={"on"} id={ label } name={ label } ref={ ref } className={`input-box ${props.error?.message && 'input-error'}`} {...props}>
                    </input>
                    <span className="checkmark"></span>
                </label>
            </div>
        )
    }
);

export default InputBox;
