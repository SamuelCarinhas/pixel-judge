import { Link } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { IButtonColor } from '../../../components/CustomButton/ICustomButton'
import InputField from '../../../components/InputField/InputField'
import './SignUpPage.css'
import { FaLock, FaRegUser } from 'react-icons/fa'
import { MdOutlineMailOutline } from 'react-icons/md'
import { useRef, useState } from 'react'
import axios from 'axios'

export default function SignUpPage() {

    const username = useRef<string>("");
    const email = useRef<string>("");
    const password = useRef<string>("");
    const confirmPassword = useRef<string>("");

    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

    const validateEmail = (email: string) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };

    function handleSignIn() {
        let errors = false;
        if(username.current.length < 3) {
            errors = true;
            setUsernameError("Username must have at least 3 characters")
        }
        if(!validateEmail(email.current)) {
            errors = true;
            setEmailError("Email must be valid");
        }
        if(password.current.length < 8) {
            errors = true;
            setPasswordError("Password must have at least 8 characters");
        }
        if(confirmPassword.current !== password.current) {
            errors = true;
            setConfirmPasswordError("Passwords must match");
        }

        if(errors) return;

        axios.post('http://localhost:8000/auth/sign-up', {

        }).then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div className='sign-up-page'>
            <span className='title'>Welcome to PixelJudge</span>
            <span>Create a new account</span>
            <InputField value={ username } error={ usernameError } setError={ setUsernameError } icon={ <FaRegUser /> } placeholder='Username' />
            <InputField value={ email } error={ emailError } setError={ setEmailError } icon={ <MdOutlineMailOutline /> } placeholder='Email' type='email' />
            <InputField value={ password } error={ passwordError } setError={ setPasswordError } icon={ <FaLock /> } placeholder='Password' type='password' />
            <InputField value={ confirmPassword } error={ confirmPasswordError } setError={ setConfirmPasswordError } icon={ <FaLock /> } placeholder='Confirm password' type='password' />
            <CustomButton color={ IButtonColor.ORANGE } text='Sign Up' onClick={ handleSignIn } />
            <span>Already have an account? <Link to='/sign-in'>Sign in now</Link></span>
        </div>
    )
}
