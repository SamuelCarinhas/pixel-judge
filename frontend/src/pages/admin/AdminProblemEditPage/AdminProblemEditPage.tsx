import { useParams } from 'react-router-dom'
import './AdminProblemEditPage.css'
import { useEffect, useState } from 'react';
import EditProblemSettings from '../../../components/admin/problem-edit/EditProblemSettings/EditProblemSettings';
import EditProblemDescription from '../../../components/admin/problem-edit/EditProblemDescription/EditProblemDescription';

export default function AdminProblemEditPage() {

    const { id } = useParams();

    const [component, setComponent] = useState<number>(0);

    useEffect(() => {
        console.log(id)
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
            component: undefined
        },
        {
            title: 'Solutions',
            component: undefined
        }
    ]

    return (
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