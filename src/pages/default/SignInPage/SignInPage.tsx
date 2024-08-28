import { Link } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { IButtonColor } from '../../../components/CustomButton/ICustomButton'
import InputField from '../../../components/InputField/InputField'
import './SignInPage.css'
import { FaLock, FaRegUser } from 'react-icons/fa'

export default function SignInPage() {
    return (
        <div className='sign-in-page'>
            <span className='title'>Welcome to PixelJudge</span>
            <InputField icon={ <FaRegUser /> } placeholder='Username'/>
            <InputField icon={ <FaLock /> } placeholder='Password'/>
            <CustomButton color={ IButtonColor.ORANGE } text='Sign In' onClick={ () => {} } />
            <span>Don't have an account? <Link to='/sign-up'>Sign up now</Link></span>
        </div>
    )
}
