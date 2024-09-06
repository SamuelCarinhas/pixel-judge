import './SelectField.css'
import { ISelectFields } from "./ISelectField"

export default function SelectField({options, ...props}: ISelectFields) {

    return (
        <select className="select-field" {...props}>
            {options.map((option, idx) => (
                <option value={option} key={idx}>{ option }</option>
            ))}
        </select>
    )
}