import { IInputField } from './IInputField'
import './InputField.css'

export default function InputField(props: IInputField) {

    return (
        <div className='input-container'>
            { props.icon }
            <input className='input-field' type='text' placeholder={props.placeholder}>
            </input>
        </div>
    )
}