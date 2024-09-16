import { useParams } from 'react-router-dom'
import './ProblemPage.css'
import { useEffect, useState } from 'react';
import { IAdminProblem } from '../../../utils/models/admin.model';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import axiosInstance from '../../../utils/axios';
import MarkdownContainer from '../../../components/containers/MarkdownContainer/MarkdownContainer';

export default function ProblemPage() {

    const { id } = useParams();
    const [notFound, setNotFound] = useState(false);
    const [problem, setProblem] = useState<IAdminProblem>();

    useEffect(() => {
        axiosInstance.get(`/problem?id=${id}`)
            .then((res) => setProblem(res.data.problem))
            .catch(() => setNotFound(true));
    }, [id]);

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
            </div>
            <div className='side-bar'>
                This will be a side bar
            </div>
        </div>
    )
}