import { useParams } from 'react-router-dom'
import './UserPage.css'

export default function UserPage() {

    const { username } = useParams();

    return (
        <div>
            { username }
        </div>
    )
}
