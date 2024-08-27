import './Footer.css'

export default function Footer() {

    const options = [
        {
            title: 'Bug Bounty'
        },
        {
            title: 'Students'
        },
        {
            title: 'Terms'
        },
        {
            title: 'Privacy Policy'
        }
    ]

    return (
        <div className='footer'>
            <div className='copyright'>
                <span>Copyright &copy; 2024 PixelJudge</span>
            </div>
            <div className='options'>
                {
                    options.map(option =>
                        <div className='option'>
                            <span> { option.title } </span>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
