import { Link } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { IButtonColor } from '../../../components/CustomButton/ICustomButton'
import InputField from '../../../components/InputField/InputField'
import './SignInPage.css'
import { FaLock, FaRegUser } from 'react-icons/fa'
import { useRef, useState } from 'react'

export default function SignInPage() {

    const identifier = useRef<string>("");
    const password = useRef<string>("");
    const [dummy, setDummy] = useState<string>("");

    return (
        <div className='sign-in-page'>
            <span className='title'>Welcome to PixelJudge</span>
            <InputField value={ identifier } error={ dummy } setError={ setDummy } icon={ <FaRegUser /> } placeholder='Username' />
            <InputField value={ password } error={ dummy } setError={ setDummy } icon={ <FaLock /> } placeholder='Password' type='password' />
            <CustomButton color={ IButtonColor.ORANGE } text='Sign In' onClick={ () => {} } />
            <span>Don't have an account? <Link to='/sign-up'>Sign up now</Link></span>
        </div>
    )
}