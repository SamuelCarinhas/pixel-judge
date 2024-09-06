import { useContext, useEffect, useState } from 'react';
import './AdminUsers.css'
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole, roleMap } from '../../../context/AuthContext/IAuthContext';
import axiosInstance from '../../../utils/axios';
import InputField from '../../InputField/InputField';
import { CiSearch } from 'react-icons/ci';
import { MdDelete, MdEdit } from 'react-icons/md';

interface IUser {
    username: string,
    createdAt: Date,
    email: string,
    role: AuthRole,
    verified: boolean
}

export default function AdminUsers() {

    const [users, setUsers] = useState<IUser[]>([]);

    const { role } = useContext(AuthContext);

    useEffect(() => {
        if(role !== AuthRole.ADMIN) return;

        axiosInstance.get('/admin/users')
            .then(res => {
                setUsers(
                    res.data.users.map((user: any) => ({
                        username: user.username,
                        createdAt: new Date(user.createdAt),
                        email: user.email,
                        role: roleMap[user.role as never],
                        verified: user.verifie
                    }))
                )
            });
    }, [role]);

    return (
        <div className='admin-users'>
            <div className='search-bar'>
                <h3>Users</h3>
                <InputField label='search' icon={<CiSearch />} placeholder='Search' />
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Registered At</th>
                        <th>User Type</th>
                        <th>Verified</th>
                        <th>Options</th>
                    </tr>
                    {
                        users.map((user, idx) => (
                            <tr key={idx}>
                                <td>{ user.username }</td>
                                <td>{ user.email }</td>
                                <td>{ user.createdAt.toLocaleString() }</td>
                                <td>{ user.role }</td>
                                <td>{ user.verified ? "yes" : "no" }</td>
                                <td className='options'>
                                    <div className='option orange'>
                                        <MdEdit />
                                    </div>
                                    <div className='option red'>
                                        <MdDelete />
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}