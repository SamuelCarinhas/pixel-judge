import { useContext, useEffect, useState } from 'react';
import './RatingPage.css'
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext/AuthContext';

export default function RatingPage() {

    const [users, setUsers] = useState<{username: string}[]>([]);

    const { axiosInstance } = useContext(AuthContext);

    useEffect(() => {
        axiosInstance.get('/profile/all')
        .then(res => {
            setUsers(res.data.profiles);
        })
        .catch(() => {});
    }, [])

    return (
        <div className='rating-page'>
            <table>
                <tbody>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Rating</th>
                    </tr>
                    {
                        users.map((user, key) => (
                            <tr key={key}>
                                <th className='rank'>{key+1}</th>
                                <th className='username'><Link to={`/user/${user.username}`}>@{user.username}</Link></th>
                                <th className='rating'>0</th>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}