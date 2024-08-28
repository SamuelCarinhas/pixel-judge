import { Link } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { IButtonColor } from '../../../components/CustomButton/ICustomButton'
import InputField from '../../../components/InputField/InputField'
import './SignUpPage.css'
import { FaLock, FaRegUser } from 'react-icons/fa'
import { MdOutlineMailOutline } from 'react-icons/md'

export default function SignUpPage() {
    return (
        <div className='sign-up-page'>
            <span className='title'>Welcome to PixelJudge</span>
            <span>Create a new account</span>
            <InputField icon={ <FaRegUser /> } placeholder='Username' />
            <InputField icon={ <MdOutlineMailOutline /> } placeholder='Email' type='email' />
            <InputField icon={ <FaLock /> } placeholder='Password' type='password' />
            <InputField icon={ <FaLock /> } placeholder='Confirm password' type='password' />
            <CustomButton color={ IButtonColor.ORANGE } text='Sign Up' onClick={ () => {} } />
            <span>Already havve an account? <Link to='/sign-in'>Sign in now</Link></span>
        </div>
    )
}
