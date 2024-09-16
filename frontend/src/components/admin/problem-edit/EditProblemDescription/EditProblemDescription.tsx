import { SubmitHandler, useForm } from 'react-hook-form'
import MarkdownContainer from '../../../containers/MarkdownContainer/MarkdownContainer'
import InputAreaField from '../../../InputAreaField/InputAreaField'
import './EditProblemDescription.css'
import CustomButton from '../../../CustomButton/CustomButton'
import Loading from '../../../Loading/Loading'
import { IButtonColor } from '../../../CustomButton/ICustomButton'
import { AuthContext } from '../../../../context/AuthContext/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IAdminProblem } from '../../../../utils/models/admin.model'
import { AuthRole } from '../../../../context/AuthContext/IAuthContext'
import axiosInstance from '../../../../utils/axios'
import axios from 'axios'

type ProblemDescriptionInput = {
    problemDescription: string
    inputDescription: string
    outputDescription: string
    restrictions: string
}

export default function EditProblemDescription() {

    const { role } = useContext(AuthContext);
    const { id } = useParams();
    const [problem, setProblem] = useState<IAdminProblem>();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<ProblemDescriptionInput>();

    const onSubmit: SubmitHandler<ProblemDescriptionInput> = async (data) => {
        if(!problem) return;

        axiosInstance.put('/admin/problem', {
            id: problem.id,
            ...data
        }).then(() => {
            console.log('Success')
        }).catch((error) => {
            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof ProblemDescriptionInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }

            throw error;
        })
    }

    useEffect(() => {
        if(!problem) return;
        setValue('problemDescription', problem.problemDescription)
        setValue('inputDescription', problem.inputDescription)
        setValue('outputDescription', problem.outputDescription)
        setValue('restrictions', problem.restrictions)
    }, [problem]);

    useEffect(() => {
        if(role !== AuthRole.ADMIN) return;
        console.log(id);
        axiosInstance.get(`/admin/problem?id=${id}`).then((res) => setProblem(res.data.problem));
    }, [role]);

    const problemDescription = watch('problemDescription');
    const inputDescription = watch('inputDescription');
    const outputDescription = watch('outputDescription');
    const restrictions = watch('restrictions');

    return (
        !problem ? <Loading />
        :
        <div className='edit-problem-description'>
            <form className='problem-description' onSubmit={ handleSubmit(onSubmit) }>
                <InputAreaField
                    {...register('problemDescription')}
                    error={errors.problemDescription}
                    label='problemDescription'
                    icon={undefined}
                    rows={10}
                    description='Problem Description'
                    />
                <InputAreaField
                    {...register('inputDescription')}
                    error={errors.inputDescription}
                    label='inputDescription'
                    icon={undefined}
                    rows={5}
                    description='Input Description'
                    />
                <InputAreaField
                    {...register('outputDescription')}
                    error={errors.outputDescription}
                    label='outputDescription'
                    icon={undefined}
                    rows={5}
                    description='Output Description'
                    />
                <InputAreaField
                    {...register('restrictions')}
                    error={errors.restrictions}
                    label='restrictions'
                    icon={undefined}
                    description='Restrictions'
                    rows={5}
                    />
                
                <CustomButton disabled={ isSubmitting } type='submit' color={ IButtonColor.GREEN } text='Save' />
                { errors.root && <span className='sign-in-page-error'>{ errors.root.message }</span> }
                {
                    isSubmitting &&
                    <Loading />
                }
            </form>

            <h1>Preview</h1>

            <div className='problem-preview'>
                <MarkdownContainer content={problemDescription}/>
                <h3>Input format</h3>
                <MarkdownContainer content={inputDescription}/>
                <h3>Output format</h3>
                <MarkdownContainer content={outputDescription}/>
                <h3>Restrictions</h3>
                <MarkdownContainer content={restrictions}/>
            </div>
        </div>
    )
}