import './EditProblemSettings.css'
import { MdDriveFileRenameOutline, MdMemory } from "react-icons/md";
import InputField from "../../../InputField/InputField";
import { LuClock } from "react-icons/lu";
import CustomButton from "../../../CustomButton/CustomButton";
import { IButtonColor } from "../../../CustomButton/ICustomButton";
import Loading from "../../../Loading/Loading";
import { SubmitHandler, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../../context/AuthContext/IAuthContext';
import { IAdminProblem } from '../../../../utils/models/admin.model';
import axiosInstance from '../../../../utils/axios';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AlertType } from '../../../../context/AlertContext/IAlertContext';
import { AlertContext } from '../../../../context/AlertContext/AlertContext';

type ProblemSettingsInput = {
    title: string
    memoryLimit: number
    timeLimit: number
}

export default function EditProblemSettings() {

    const { role } = useContext(AuthContext);
    const { id } = useParams();
    const { addAlert } = useContext(AlertContext);
    const [problem, setProblem] = useState<IAdminProblem>();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ProblemSettingsInput>();

    const onSubmit: SubmitHandler<ProblemSettingsInput> = async (data) => {
        if(!problem) return;

        axiosInstance.put('/admin/problem', {
            id: problem.id,
            ...data
        }).then(() => {addAlert({
            type: AlertType.SUCCESS,
            title: 'Success',
            text: 'Problem settings updated'
        })
        }).catch((error) => {
            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof ProblemSettingsInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }

            throw error;
        })
    }

    useEffect(() => {
        if(!problem) return;
        setValue('title', problem.title)
        setValue('memoryLimit', problem.memoryLimit)
        setValue('timeLimit', problem.timeLimit)
    }, [problem]);

    useEffect(() => {
        if(role !== AuthRole.ADMIN) return;
        console.log(id);
        axiosInstance.get(`/admin/problem?id=${id}`).then((res) => setProblem(res.data.problem));
    }, [role]);

    return (
        !problem ? <Loading />
        :
        <form className='edit-problem-settings' onSubmit={ handleSubmit(onSubmit) }>
            <InputField
                    {...register("title", {required: "Problem Limit is required"})}
                    error={errors.title}
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