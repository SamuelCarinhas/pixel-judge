import { Link, useNavigate, useParams } from 'react-router-dom'
import './ProblemPage.css'
import { useContext, useEffect, useState } from 'react';
import { IAdminProblem } from '../../../utils/models/admin.model';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import MarkdownContainer from '../../../components/containers/MarkdownContainer/MarkdownContainer';
import { CiTimer } from 'react-icons/ci';
import { IoIosPricetags, IoIosSend } from 'react-icons/io';
import { GoGraph } from 'react-icons/go';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../context/AuthContext/IAuthContext';
import InputFile from '../../../components/InputFile/InputFile';
import { FaFile, FaUpload } from 'react-icons/fa';
import { SubmitHandler, useForm } from 'react-hook-form';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';
import Loading from '../../../components/Loading/Loading';
import { AlertContext } from '../../../context/AlertContext/AlertContext';
import { AlertType } from '../../../context/AlertContext/IAlertContext';
import { ISubmission } from '../../../utils/models/submission.model';
import axios from 'axios';

type SubmitInput = {
    code: FileList
}

export default function ProblemPage() {

    const { id } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [problem, setProblem] = useState<IAdminProblem>();
    const { role, axiosInstance } = useContext(AuthContext);
    const { addAlert } = useContext(AlertContext);
    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState<ISubmission[]>([]);

    useEffect(() => {
        axiosInstance.get(`/problem?id=${id}`)
            .then((res) => setProblem(res.data.problem))
            .catch(() => setNotFound(true));

        axiosInstance.get(`/submission/my-recent-problem?id=${id}`)
            .then(res => {
                const submissions = res.data.submissions as ISubmission[]
                submissions.map(submission => submission.createdAt = new Date(submission.createdAt))
                submissions.map(submission => submission.updatedAt = new Date(submission.updatedAt))
                setSubmissions(submissions);
            })
    }, [id]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<SubmitInput>();

    const onSubmit: SubmitHandler<SubmitInput> = async (data) => {
        const formData = new FormData();
        formData.append('code', data.code[0])
        axiosInstance.post(`/problem/submit?id=${id}`, formData)
        .then(() => {
            addAlert({
                type: AlertType.INFO,
                title: 'Info',
                text: 'Solution submitted'
            })
            navigate('/submissions')
        }).catch((error) => {
            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof SubmitInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }

            throw error;
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
                    <span>Time Limit: { problem.timeLimit } seconds</span>
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
                                {
                                    submissions.map((submission, index) => (
                                        <Link to={`/submission/${submission.id}`} key={index}>
                                            <div className={`recent-submission ${submission.verdict === 'Accepted' ? 'green' : 'red'}`}>
                                                    <span><FaFile /></span>
                                                    <span>{ submission.createdAt.toLocaleString() }</span>
                                            </div>
                                        </Link>
                                    ))
                                }
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