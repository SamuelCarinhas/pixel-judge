import './Navbar.css'
import logo from '../../assets/images/logo.png'

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

    return (
        <div className='navbar'>
            <div className='logo'>
                <img src={ logo }></img>
                <span>PixelJudge</span>
            </div>
            <div className='options'>
                {
                    options.map(option =>
                    <div className='option'>
                        <span>{ option.title }</span>
                    </div>
                    )
                }
            </div>
        </div>
    )
}