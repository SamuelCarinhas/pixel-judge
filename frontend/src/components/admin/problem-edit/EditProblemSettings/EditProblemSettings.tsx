import './EditProblemSettings.css'
import { MdDriveFileRenameOutline, MdMemory } from "react-icons/md";
import InputField from "../../../InputField/InputField";
import { LuClock } from "react-icons/lu";
import CustomButton from "../../../CustomButton/CustomButton";
import { IButtonColor } from "../../../CustomButton/ICustomButton";
import Loading from "../../../Loading/Loading";
import { SubmitHandler, useForm } from "react-hook-form";

type ProblemSettingsInput = {
    problemName: string
    memoryLimit: number
    timeLimit: number
}

export default function EditProblemSettings() {

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<ProblemSettingsInput>();

    const onSubmit: SubmitHandler<ProblemSettingsInput> = async (data) => {
        console.log(data)
        setError('root', { message: 'TODO' })
    }

    return (
        <form className='edit-problem-settings' onSubmit={ handleSubmit(onSubmit) }>
            <InputField
                    {...register("problemName", {required: "Problem Limit is required"})}
                    error={errors.problemName}
                icon={ <MdDriveFileRenameOutline /> }
                label='problem-name'
                description='Problem Name'
                placeholder='Problem Name' />
            <InputField
                {...register("memoryLimit", {required: "Memory Limit is required"})}
                error={errors.memoryLimit}
                type='number'
                icon={ <MdMemory /> }
                label='memory-limit'
                description='Memory Limit (MB)'
                placeholder='256' />
            <InputField
                {...register("timeLimit", {required: "Time Limit is required"})}
                error={errors.timeLimit}
                type='number'
                icon={ <LuClock /> }
                label='time-limit'
                description='Time Limit (ms)'
                placeholder='1000' />
            <CustomButton disabled={ isSubmitting } type='submit' color={ IButtonColor.GREEN } text='Save' />
            { errors.root && <span className='sign-in-page-error'>{ errors.root.message }</span> }
            {
                isSubmitting &&
                <Loading />
            }
        </form>
    )
}