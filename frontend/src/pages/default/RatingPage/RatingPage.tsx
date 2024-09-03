import { useEffect, useState } from 'react';
import './RatingPage.css'
import axios from 'axios';
import { Link } from 'react-router-dom';

const REST_URL = import.meta.env.VITE_REST_URL

export default function RatingPage() {

    const [users, setUsers] = useState<{username: string}[]>([]);

    useEffect(() => {
        axios.get(`${REST_URL}/profile/all`)
        .then(res => {
            setUsers(res.data.profiles);
        })
        .catch(() => {});
    })

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