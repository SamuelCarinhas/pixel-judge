import { useNavigate } from 'react-router-dom'
import './Footer.css'

export default function Footer() {

    const navigate = useNavigate();

    const options = [
        {
            title: 'Bug Bounty',
            url: '/bug-bounty'
        },
        {
            title: 'Students',
            url: '/students'
        },
        {
            title: 'Terms',
            url: '/terms'
        },
        {
            title: 'Privacy Policy',
            url: '/privacy-policy'
        }
    ]

    return (
        <div className='footer'>
            <div className='copyright'>
                <span>Copyright &copy; 2024 PixelJudge</span>
            </div>
            <div className='options'>
                {
                    options.map((option, index) =>
                        <div key={index} className='option'>
                            <span onClick={ () => navigate(option.url) }> { option.title } </span>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
