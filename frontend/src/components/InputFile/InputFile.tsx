import { forwardRef } from 'react'
import './InputFile.css'
import { IInputFile } from './IInputFile';

const InputFile = forwardRef<HTMLInputElement, IInputFile>(({label, icon, ...props}, ref) => {
        return (
            <div className='input-file-area'>
                { props.description && <label> { props.description } </label> }
                {props.error && <span className='error'> { props.error.message } </span> }
                <label className='input-file-container'>
                    { icon }
                    <input type='file' autoComplete={"on"} id={ label } name={ label } ref={ ref } className={`input-file ${props.error?.message && 'input-error'}`} {...props}>
                    </input>
                </label>
            </div>
        )
    }
);

export default InputFile;
