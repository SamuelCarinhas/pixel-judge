import { Link } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { IButtonColor } from '../../../components/CustomButton/ICustomButton'
import InputField from '../../../components/InputField/InputField'
import './SignUpPage.css'
import { FaLock, FaRegUser } from 'react-icons/fa'
import { MdOutlineMailOutline } from 'react-icons/md'
import { SubmitHandler, useForm } from 'react-hook-form'
import Loading from '../../../components/Loading/Loading'

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


    const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
        await new Promise((res) => setTimeout(res, 1000));
        console.log(data);
        setError('root', {
            message: "Server error"
        })
    }

    return (
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
