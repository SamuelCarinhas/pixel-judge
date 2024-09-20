import { useEffect, useState } from 'react';
import './SubmissionsPage.css'
import { Link } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { ISubmission } from '../../../utils/models/submission.model';

export default function SubmissionsPage() {

    const [submissions, setSubmissions] = useState<ISubmission[]>([]);

    useEffect(() => {
        axiosInstance.get('/submission/all')
        .then(res => {
            const submissions = res.data.submissions as ISubmission[]
            submissions.map(submission => submission.createdAt = new Date(submission.createdAt))
            submissions.map(submission => submission.updatedAt = new Date(submission.updatedAt))
            setSubmissions(submissions);
        })
        .catch(() => {});
    }, [])

    return (
        <div className='submissions-page'>
            <table>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Submitted</th>
                        <th>Author</th>
                        <th>Problem</th>
                        <th>Verdict</th>
                    </tr>
                    {
                        submissions.map((submission, key) => (
                            <tr key={key}>
                                <th className='id'><Link to={`/submission/${submission.id}`}>{submission.id}</Link></th>
                                <th className='submitted'>{submission.createdAt.toLocaleString()}</th>
                                <th className='author'><Link to={`/user/${submission.author.username}`}>@{submission.author.username}</Link></th>
                                <th className='problem'><Link to={`/problem/${submission.problem.id}`}>#{submission.problem.id}</Link></th>
                                <th className={`verdict ${submission.verdict === 'Accepted' ? 'green' : 'red'}`}>{submission.verdict}</th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}