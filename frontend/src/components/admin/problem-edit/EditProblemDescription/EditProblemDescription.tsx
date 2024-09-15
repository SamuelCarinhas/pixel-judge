import { SubmitHandler, useForm } from 'react-hook-form'
import MarkdownContainer from '../../../containers/MarkdownContainer/MarkdownContainer'
import InputAreaField from '../../../InputAreaField/InputAreaField'
import './EditProblemDescription.css'
import CustomButton from '../../../CustomButton/CustomButton'
import Loading from '../../../Loading/Loading'
import { IButtonColor } from '../../../CustomButton/ICustomButton'

type ProblemDescriptionInput = {
    problemDescription: string
    inputDescription: string
    outputDescription: string
    restrictions: string
}

export default function EditProblemDescription() {

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<ProblemDescriptionInput>();

    const onSubmit: SubmitHandler<ProblemDescriptionInput> = async (data) => {
        console.log(data)
        setError('root', { message: 'TODO' })
    }

    const problemDescription = watch('problemDescription');
    const inputDescription = watch('inputDescription');
    const outputDescription = watch('outputDescription');
    const restrictions = watch('restrictions');

    return (
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