import { useContext, useEffect, useState } from 'react';
import './SubmissionsPage.css'
import { Link } from 'react-router-dom';
import { ISubmission } from '../../../utils/models/submission.model';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import PagedContainer from '../../../components/containers/PagedContainer/PagedContainer';

export default function SubmissionsPage() {

    const color = {
        'Accepted': 'green',
        'Wrong Answer': 'red',
        'Runtime Error': 'red',
        'Time Limit Exceeded': 'red'
    }

    const [submissions, setSubmissions] = useState<ISubmission[]>([]);
    const { socket } = useContext(AuthContext);

    useEffect(() => {
        if(socket === null) return;
        socket.on('submission_status', ({submissionId, verdict}: {submissionId: string, verdict: string}  ) => {
            setSubmissions(prevSubmissions =>
                prevSubmissions.map(submission =>
                    submission.id === submissionId ? { ...submission, verdict } : submission
                )
            );
        });
    }, [socket])

    function parseSubmissions(subs: ISubmission[]) {
        subs.map(submission => submission.createdAt = new Date(submission.createdAt))
        subs.map(submission => submission.updatedAt = new Date(submission.updatedAt))
        return subs
    }

    return (
        <div className='submissions-page'>
            <PagedContainer<ISubmission> setValues={setSubmissions} restPath='/submission/all' title='Submissions'>
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
                            parseSubmissions(submissions).map((submission, key) => (
                                <tr key={key}>
                                    <th className='id'><Link to={`/submission/${submission.id}`}>{submission.id}</Link></th>
                                    <th className='submitted'>{submission.createdAt.toLocaleString()}</th>
                                    <th className='author'><Link to={`/user/${submission.author.username}`}>@{submission.author.username}</Link></th>
                                    <th className='problem'><Link to={`/problem/${submission.problem.id}`}>#{submission.problem.id}</Link></th>
                                    <th className={`verdict ${color[submission.verdict as never] ? color[submission.verdict as never] : 'black'}`}>{submission.verdict}</th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </PagedContainer>
        </div>
    )
}