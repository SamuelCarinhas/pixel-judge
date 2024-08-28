import { IInputField } from './IInputField'
import './InputField.css'

export default function InputField(props: IInputField) {

    return (
        <div className='input-text'>
            <div className='input-container'>
                { props.icon }
                <input className='input-field' type={props.type || 'text'} placeholder={props.placeholder}>
                </input>
            </div>
        </div>
    )
}