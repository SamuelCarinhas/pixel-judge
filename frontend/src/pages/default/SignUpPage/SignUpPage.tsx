import { Link } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { IButtonColor } from '../../../components/CustomButton/ICustomButton'
import InputField from '../../../components/InputField/InputField'
import './SignUpPage.css'
import { FaLock, FaRegUser } from 'react-icons/fa'
import { MdOutlineMailOutline } from 'react-icons/md'
import { SubmitHandler, useForm } from 'react-hook-form'
import Loading from '../../../components/Loading/Loading'
import { useState } from 'react'
import axios from 'axios'

const REST_URL = import.meta.env.VITE_REST_URL

type SignUpInput = {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export default function SignUpPage() {

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<SignUpInput>();

    const [completed, setCompleted] = useState<boolean>(false);

    const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
        if(data.confirmPassword !== data.password) {
            setError("confirmPassword", {
                message: "The passwords are not equal"
            })
            return;
        }
        try {
            await axios.post(`${REST_URL}/auth/sign-up`, data);
            setCompleted(true);
        } catch(error) {
            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof SignUpInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }
            return;
        }
    }

    return (
        completed ?
        <div className='sign-up-page'>
            <span className='sign-up-success'>A confirmation email has been sent to your inbox. Please follow the instructions provided to complete the process.</span>
        </div>
        :
        <form className='sign-up-page' onSubmit={ handleSubmit(onSubmit) }>
            <span className='title'>Welcome to PixelJudge</span>
            <span>Create a new account</span>
            <InputField
                {...register("username", {required: "Username is required"})}
                error={errors.username}
                label='username'
                icon={ <FaRegUser /> }
                placeholder='Username' />
            <InputField
                {...register("email", {required: "Email is required"})}
                error={errors.email}
                label='email'
                type='email'
                icon={ <MdOutlineMailOutline /> }
                placeholder='Email' />
            <InputField
                {...register("password", {required: "Password is required"})}
                error={errors.password}
                label='password'
                icon={ <FaLock /> }
                placeholder='Password'
                type='password' />
            <InputField
                {...register("confirmPassword")}
                error={errors.confirmPassword}
                label='confirmPassword'
                icon={ <FaLock /> }
                placeholder='Confirm Password'
                type='password' />
            <CustomButton color={ IButtonColor.ORANGE } text='Sign Up' />
            { errors.root && <span className='sign-in-page-error'>{ errors.root.message }</span> }
            {
                isSubmitting &&
                <Loading />
            }
            <span>Already have an account? <Link to='/sign-in'>Sign in now</Link></span>
        </form>
    )
}
