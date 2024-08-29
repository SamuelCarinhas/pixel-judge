import './CustomBotton.css'
import { buttonColorMap, ICustomButton } from "./ICustomButton";

export default function CustomButton(props: ICustomButton) {

    return (
        <button disabled={props.disabled} className={`custom-button ${buttonColorMap[props.color]}`} onClick={ props.onClick }>
            { props.text }
        </button>
    )
}