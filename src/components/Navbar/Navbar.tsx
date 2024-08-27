import './Navbar.css'
import logo from '../../assets/images/logo.png'
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from 'react';

export default function Navbar() {

    const options = [
        {
            title: 'Problems'
        },
        {
            title: 'Contests'
        },
        {
            title: 'Rating'
        },
        {
            title: 'Forum'
        }
    ]

    const [showOptions, setShowOptions] = useState<boolean>(false);

    return (
        <div className='navbar'>
            <div className='logo'>
                <img src={ logo }></img>
                <span>PixelJudge</span>
            </div>
            <div className='drop' onClick={() => setShowOptions(!showOptions)}>
                <GiHamburgerMenu />
            </div>
            <div className={`options ${showOptions ? 'show' : ''}`}>
                {
                    options.map((option, index) =>
                    <div key={index} className='option'>
                        <span>{ option.title }</span>
                    </div>
                    )
                }
            </div>
        </div>
    )
}