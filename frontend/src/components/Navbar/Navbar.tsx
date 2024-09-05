import './Navbar.css'
import logo from '../../assets/images/logo.png'
import { GiHamburgerMenu } from "react-icons/gi";
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomButton from '../CustomButton/CustomButton';
import { IButtonColor } from '../CustomButton/ICustomButton';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { AuthRole } from '../../context/AuthContext/IAuthContext';

export default function Navbar() {

    const { role, username } = useContext(AuthContext);

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
            <Link className='logo' to={'/'}>
                <img src={ logo }></img>
                <span>PixelJudge</span>
            </Link>
            <div className='drop' onClick={() => setShowOptions(!showOptions)}>
                <GiHamburgerMenu />
            </div>
            <div className={`options ${showOptions ? 'show' : ''}`}>
                {
                    options.map((option, index) =>
                    <Link key={index} className='option' to={option.url}>
                        <span>{ option.title }</span>
                    </Link>
                    )
                }
                {role === AuthRole.ADMIN &&
                    <Link className='option' to="/admin">
                        <span>Admin</span>
                    </Link>
                }
                {
                    role !== AuthRole.LOADING && role !== AuthRole.DEFAULT
                    ?
                    <Link className='option' to={`/user/${username}`}>
                       <span>{ username }</span>
                    </Link>
                    :
                    <Link className='option' to={'/sign-in'}>
                        <CustomButton text='Sign In' color={ IButtonColor.GREEN } />
                    </Link>
                }
            </div>
        </div>
    )
}