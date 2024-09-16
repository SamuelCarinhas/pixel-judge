import { forwardRef } from 'react'
import './InputFile.css'
import { IInputFile } from './IInputFile';

const InputFile = forwardRef<HTMLInputElement, IInputFile>(({label, icon, ...props}, ref) => {
        return (
            <div className='input-field'>
                { props.description && <label> { props.description } </label> }
                {props.error && <span className='error'> { props.error.message } </span> }
                <div className='input-container'>
                    { icon }
                    <input type='file' autoComplete={"on"} id={ label } name={ label } ref={ ref } className={`input-field ${props.error?.message && 'input-error'}`} {...props}>
                    </input>
                </div>
            </div>
        )
    }
);

export default InputFile;
