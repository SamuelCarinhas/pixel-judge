import { Link } from 'react-router-dom'
import CustomButton from '../../../components/CustomButton/CustomButton'
import { IButtonColor } from '../../../components/CustomButton/ICustomButton'
import InputField from '../../../components/InputField/InputField'
import './SignInPage.css'
import { FaLock, FaRegUser } from 'react-icons/fa'
import { SubmitHandler, useForm } from 'react-hook-form'
import Loading from '../../../components/Loading/Loading'

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


    const onSubmit: SubmitHandler<SignInInput> = async (data) => {
        await new Promise((res) => setTimeout(res, 1000));
        console.log(data);
        setError('root', {
            message: "Invalid credentials"
        })
    }

    return (
        <form className='sign-in-page' onSubmit={ handleSubmit(onSubmit) }>
            <span className='title'>Welcome to PixelJudge</span>
            <InputField {...register("username", {required: "Username is required"})} error={errors.username} label='username' icon={ <FaRegUser /> } placeholder='Username' />
            <InputField {...register("password", {required: "Password is required"})} error={errors.password} label='password' icon={ <FaLock /> } placeholder='Password' type='password' />
            <CustomButton disabled={ isSubmitting } type='submit' color={ IButtonColor.ORANGE } text='Sign In' onClick={ () => {} } />
            { errors.root && <span className='sign-in-page-error'>{ errors.root.message }</span> }
            {
                isSubmitting &&
                <Loading />
            }
            <span>Don't have an account? <Link to='/sign-up'>Sign up now</Link></span>
        </form>
    )
}
