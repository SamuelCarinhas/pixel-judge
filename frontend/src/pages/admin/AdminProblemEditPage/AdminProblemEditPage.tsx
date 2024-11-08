import { useParams } from 'react-router-dom'
import './AdminProblemEditPage.css'
import { useContext, useEffect, useState } from 'react';
import EditProblemSettings from '../../../components/admin/problem-edit/EditProblemSettings/EditProblemSettings';
import EditProblemDescription from '../../../components/admin/problem-edit/EditProblemDescription/EditProblemDescription';
import NotFoundPage from '../../default/NotFoundPage/NotFoundPage';
import EditProblemTestCases from '../../../components/admin/problem-edit/EditProblemTestCases/EditProblemTestCases';
import { AuthContext } from '../../../context/AuthContext/AuthContext';

export default function AdminProblemEditPage() {

    const { id } = useParams();

    const { axiosInstance } = useContext(AuthContext);

    const [component, setComponent] = useState<number>(0);
    const [notFound, setNotFound] = useState<boolean>(false);

    useEffect(() => {
        axiosInstance.get(`/admin/problem?id=${id}`).catch(() => setNotFound(true))
    }, [id]);

    const options = [
        {
            title: 'Settings',
            component: <EditProblemSettings />
        },
        {
            title: 'Description',
            component: <EditProblemDescription />
        },
        {
            title: 'Test Cases',
            component: <EditProblemTestCases />
        },
        {
            title: 'Solutions',
            component: undefined
        }
    ]

    return (
        notFound ? <NotFoundPage />
        :
        <div className="admin-problem-edit">
            <div className='top-bar'>
                {
                    options.map((option, idx) => (
                        <div className={`option ${idx === component && 'selected'}`} key={idx} onClick={ () => setComponent(idx) }>
                            { option.title }
                        </div>
                    ))
                }
            </div>
            {
                options[component].component
            }
        </div>
    )
}