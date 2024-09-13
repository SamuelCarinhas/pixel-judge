import { useParams } from 'react-router-dom'
import './AdminProblemEditPage.css'
import { useEffect } from 'react';

export default function AdminProblemEditPage() {

    const { id } = useParams();

    useEffect(() => {
        console.log(id)
    }, [id]);

    return (
        <div className="admin-problem-edit">

        </div>
    )
}