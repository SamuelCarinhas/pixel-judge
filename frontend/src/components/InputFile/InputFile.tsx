import { forwardRef, useState } from 'react'
import './InputFile.css'
import { IInputFile } from './IInputFile';

const InputFile = forwardRef<HTMLInputElement, IInputFile>(({label, icon, onChange, ...props}, ref) => {
        const [fileName, setFileName] = useState<string | null>(null);

        function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
            const file = event.target.files?.[0];
            if (file) setFileName(file.name);
            if (onChange) onChange(event);
        };

        return (
            <div className='input-file-area'>
                {props.error && <span className='error'> { props.error.message } </span> }
                <label className='input-file-container'>
                    { icon }
                    { fileName ?
                        <span className="file-name">{fileName}</span>
                        :
                        props.description && <span> { props.description } </span>
                    }
                    <input onChange={ handleFileChange } type='file' autoComplete={"on"} id={ label } name={ label } ref={ ref } className={`input-file ${props.error?.message && 'input-error'}`} {...props}>
                    </input>
                </label>
            </div>
        )
    }
);

export default InputFile;
