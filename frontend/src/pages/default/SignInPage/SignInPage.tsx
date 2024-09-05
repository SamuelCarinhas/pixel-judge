import { Link } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { IButtonColor } from '../../../components/CustomButton/ICustomButton'
import InputField from '../../../components/InputField/InputField'
import './SignInPage.css'
import { FaLock, FaRegUser } from 'react-icons/fa'
import { SubmitHandler, useForm } from 'react-hook-form'
import Loading from '../../../components/Loading/Loading'
import axios from 'axios'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext/AuthContext'

const REST_URL = import.meta.env.VITE_REST_URL

type SignInInput = {
    username: string
    password: string
}

export default function SignInPage() {

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<SignInInput>();

    const { login } = useContext(AuthContext);

    const onSubmit: SubmitHandler<SignInInput> = async (data) => {
        try {
            const res = await axios.post(`${REST_URL}/auth/sign-in`, data);
            login(res.data.accessToken, res.data.refreshToken);
        } catch(error) {
            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof SignInInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }
            return;
        }
    }

    return (
        <form className='sign-in-page' onSubmit={ handleSubmit(onSubmit) }>
            <span className='title'>Welcome to PixelJudge</span>
            <InputField
                {...register("username", {required: "Username is required"})}
                error={errors.username}
                label='username'
                icon={ <FaRegUser /> }
                placeholder='Username' />
            <InputField
                {...register("password", {required: "Password is required"})}
                error={errors.password}
                label='password'
                icon={ <FaLock /> }
                placeholder='Password'
                type='password' />
            <CustomButton disabled={ isSubmitting } type='submit' color={ IButtonColor.ORANGE } text='Sign In' />
            { errors.root && <span className='sign-in-page-error'>{ errors.root.message }</span> }
            {
                isSubmitting &&
                <Loading />
            }
            <span>Don't have an account? <Link to='/sign-up'>Sign up now</Link></span>
        </form>
    )
}
