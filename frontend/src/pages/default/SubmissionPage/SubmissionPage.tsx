import { Link, useParams } from 'react-router-dom'
import './SubmissionPage.css'
import { useEffect, useState } from 'react';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import axiosInstance from '../../../utils/axios';
import { ISubmission } from '../../../utils/models/submission.model';

export default function SubmissionPage() {

    const { id } = useParams();
    const [notFound, setNotFound] = useState(false);

    const [submission, setSubmission] = useState<ISubmission>();

    useEffect(() => {
        axiosInstance.get(`/submission?id=${id}`)
            .then(res => {
                const submission = res.data.submission as ISubmission
                submission.createdAt = new Date(submission.createdAt)
                submission.updatedAt = new Date(submission.updatedAt)
                setSubmission(submission);
            })
            .catch(() => setNotFound(true));
    }, [id]);

    return (
        notFound ? <NotFoundPage />
        :
        !submission ? undefined
        :
        <div className='submission-page'>
            <span>Problem: <Link to={`/problem/${submission.problem.id}`}>{submission.problem.id}</Link></span>
            <pre className='submission'>
                {submission.code}
            </pre>
            <div className='info'>
                <span>Author: <Link to={`/user/${submission.author.username}`}>@{submission.author.username}</Link></span> 
                <span>Submitted At: {submission.createdAt.toLocaleString()}</span>
                <span>Verdict: <span className={submission.verdict === 'Accepted' ? 'green' : 'red'}>{submission.verdict}</span></span>
                <span>Details: 
                    <pre>
                        { submission.details }
                    </pre>
                </span>
            </div>
        </div>
    )
}