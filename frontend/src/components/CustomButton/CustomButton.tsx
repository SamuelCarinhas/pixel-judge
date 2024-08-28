import './CustomBotton.css'
import { buttonColorMap, ICustomButton } from "./ICustomButton";

export default function CustomButton(props: ICustomButton) {

    return (
        <div className={`custom-button ${buttonColorMap[props.color]}`} onClick={ props.onClick }>
            { props.text }
        </div>
    )
}