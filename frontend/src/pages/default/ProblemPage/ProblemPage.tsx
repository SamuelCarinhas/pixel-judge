import { useParams } from 'react-router-dom'
import './ProblemPage.css'
import { useContext, useEffect, useState } from 'react';
import { IAdminProblem } from '../../../utils/models/admin.model';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import axiosInstance from '../../../utils/axios';
import MarkdownContainer from '../../../components/containers/MarkdownContainer/MarkdownContainer';
import { CiTimer } from 'react-icons/ci';
import { IoIosPricetags, IoIosSend } from 'react-icons/io';
import { GoGraph } from 'react-icons/go';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../context/AuthContext/IAuthContext';
import InputFile from '../../../components/InputFile/InputFile';
import { FaUpload } from 'react-icons/fa';
import { SubmitHandler, useForm } from 'react-hook-form';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';
import Loading from '../../../components/Loading/Loading';
import { AlertContext } from '../../../context/AlertContext/AlertContext';
import { AlertType } from '../../../context/AlertContext/IAlertContext';

type SubmitInput = {
    code: FileList
}

export default function ProblemPage() {

    const { id } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [problem, setProblem] = useState<IAdminProblem>();
    const { role } = useContext(AuthContext);
    const { addAlert } = useContext(AlertContext);

    useEffect(() => {
        axiosInstance.get(`/problem?id=${id}`)
            .then((res) => setProblem(res.data.problem))
            .catch(() => setNotFound(true));
    }, [id]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<SubmitInput>();

    const onSubmit: SubmitHandler<SubmitInput> = async (data) => {
        console.log(data);
        await new Promise(resolve => setTimeout(resolve, 3000));
        setError('root', { message: "Server error" });
        addAlert({
            type: AlertType.INFO,
            title: 'Info',
            text: 'Solution submitted'
        })
    }

    return (
        notFound ? <NotFoundPage />
        :
        !problem ? undefined
        :
        <div className='problem-page'>
            <div className='problem'>
                <div className='problem-settings'>
                    <h2>{ problem.title } </h2>
                    <span>Memory Limit: { problem.memoryLimit } MB</span>
                    <span>Time Limit: { problem.timeLimit } ms</span>
                </div>
                <div className='problem-description'>
                    <h3>Description</h3>
                    <MarkdownContainer content={ problem.problemDescription }/>
                    <h3>Input Format</h3>
                    <MarkdownContainer content={ problem.inputDescription }/>
                    <h3>Output Format</h3>
                    <MarkdownContainer content={ problem.outputDescription }/>
                    <h3>Restrictions</h3>
                    <MarkdownContainer content={ problem.restrictions }/>
                </div>
                {
                    problem.testCases.length > 0 &&
                    <>
                        <h3>Examples</h3>
                        <div className='examples'>
                            {problem.testCases.map((example, idx) => (
                                <div className='example' key={idx}>
                                    <h4>Input {idx+1}</h4>
                                    <pre>
                                        {
                                            example.input
                                        }
                                    </pre>
                                    <h4>Output {idx+1}</h4>
                                    <pre>
                                        {
                                            example.output
                                        }
                                    </pre>
                                </div>
                            ))}
                        </div>
                    </>
                }
            </div>
            <div className='side-bar'>
                {
                    role !== AuthRole.LOADING && role !== AuthRole.DEFAULT
                    &&
                    <>
                        <div className='side-option submit-problem'>
                            <div className='header'><CiTimer /> Recent Submissions</div>
                            <div className='content'>
                                None
                            </div>
                        </div>
                        <div className='side-option submit-problem'>
                            <div className='header'><IoIosSend /> Submit Problem</div>
                            <div className='content'>
                                <form onSubmit={ handleSubmit(onSubmit) }>
                                {
                                    isSubmitting ?
                                    <Loading />
                                    :
                                    <>
                                        <InputFile
                                            icon={<FaUpload />}
                                            description='Choose file'
                                            label='code'
                                            error={errors.code}
                                            {...register('code',
                                                {
                                                    required: 'File is required',
                                                    validate: {
                                                        singleFile: (files) => files.length === 1 || 'Please select only one file'
                                                    }
                                                }
                                            )}
                                        />
                                        <CustomButton disabled={ isSubmitting } type='submit' color={ IButtonColor.GREEN } text='Submit' />
                                        { errors.root && <span className='red'>{ errors.root.message }</span> }
                                    </>
                                }
                                </form>
                                </div>
                        </div>
                    </>
                }
                <div className='side-option submit-problem'>
                    <div className='header'><IoIosPricetags /> Tags</div>
                    <div className='content'>
                        None
                    </div>
                </div>
                <div className='side-option submit-problem'>
                    <div className='header'><GoGraph /> Statistics</div>
                    <div className='content'>
                        None
                    </div>
                </div>
            </div>
        </div>
    )
}