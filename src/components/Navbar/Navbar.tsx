import './Navbar.css'
import logo from '../../assets/images/logo.png'
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

    const navigate = useNavigate();

    const options = [
        {
            title: 'Problems',
            url: '/problems'
        },
        {
            title: 'Contests',
            url: '/contests'
        },
        {
            title: 'Rating',
            url: '/rating'
        },
        {
            title: 'Forum',
            url: '/forum'
        }
    ]

    const [showOptions, setShowOptions] = useState<boolean>(false);

    return (
        <div className='navbar'>
            <div className='logo' onClick={ () => navigate('/') }>
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
                        <span onClick={ () => navigate(option.url) }>{ option.title }</span>
                    </div>
                    )
                }
            </div>
        </div>
    )
}