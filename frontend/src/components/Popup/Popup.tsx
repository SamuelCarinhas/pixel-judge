import { IoIosClose } from 'react-icons/io'
import './Popup.css'
import IPopup from './IPopup'

export default function Popup(props: IPopup) { 
    return (
        <div className="popup">
            <div className='content'>
                <div className='popup-options'>
                    <h3>{ props.title } </h3>
                    <div className='popup-close' onClick={ props.onClose }>
                        <IoIosClose />
                    </div>
                </div>
                {
                    props.children
                }
            </div>
        </div>
    )
}