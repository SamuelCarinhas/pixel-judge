import { useContext, useEffect, useState } from 'react';
import './ProblemsPage.css'
import { IAdminProblem } from '../../../utils/models/admin.model';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/AuthContext';

export default function ProblemsPage() {

    const [problems, setProblems] = useState<IAdminProblem[]>([]);

    const { axiosInstance } = useContext(AuthContext);

    useEffect(() => {
        axiosInstance.get('/problem/all')
        .then(res => {
            setProblems(res.data.problems);
        })
        .catch(() => {});
    }, [])

    return (
        <div className='problems-page'>
            <table>
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Problem Name</th>
                    </tr>
                    {
                        problems.map((problem, key) => (
                            <tr key={key}>
                                
                                <th className='id'>
                                    <Link to={`/problem/${problem.id}`}>
                                        { problem.id }
                                    </Link>
                                </th>
                                <th className='problem-name'>
                                    <Link to={`/problem/${problem.id}`}>
                                        { problem.title }
                                    </Link>
                                </th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}