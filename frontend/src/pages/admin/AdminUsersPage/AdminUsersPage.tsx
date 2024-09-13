import { useContext, useEffect, useState } from 'react';
import './AdminUsersPage.css'
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole, roleMap, roleNames, roleTags } from '../../../context/AuthContext/IAuthContext';
import axiosInstance from '../../../utils/axios';
import { CiSearch } from 'react-icons/ci';
import { MdCancel, MdDelete, MdEdit } from 'react-icons/md';
import { FaSave } from 'react-icons/fa';
import InputField from '../../../components/InputField/InputField';
import SelectField from '../../../components/SelectField/SelectField';

interface IUser {
    username: string,
    createdAt: Date,
    email: string,
    role: AuthRole,
    verified: boolean
}

export default function AdminUsersPage() {

    const [users, setUsers] = useState<IUser[]>([]);
    const [currentEditing, setCurrentEditing] = useState<IUser | undefined>(undefined);
    const [search, setSearch] = useState<string>("");

    const { role, username } = useContext(AuthContext);

    const roles = ['USER', 'ADMIN', 'MODERATOR'];

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
                        verified: user.verified
                    }))
                )
            });
    }, [role]);

    function saveUser() {
        if(!currentEditing) return;

        console.log(currentEditing)

        axiosInstance.post('/admin/user', {
            username: currentEditing.username,
            validate: currentEditing.verified,
            role: roleTags[currentEditing.role]
        })
        .then(() => {
            const copyUsers = [...users];
            const idx = copyUsers.findIndex((user) => user.username === currentEditing.username);
            if(idx === -1) return;
            copyUsers[idx] = currentEditing!;
            setUsers(copyUsers);
            setCurrentEditing(undefined);
        })
        .catch((err) => console.log(err));
    }

    function deleteUser() {
        alert('Function not available');
    }

    return (
        <div className='admin-users'>
            <div className='search-bar'>
                <h3>Users</h3>
                <InputField value={search} onChange={ (e) => setSearch(e.target.value) }label='search' icon={<CiSearch />} placeholder='Search' />
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
                        users.filter(user => user.username.toLowerCase().includes(search.toLowerCase())).map((user, idx) => (
                            <tr key={idx}>
                                <td>{ user.username }</td>
                                <td>{ user.email }</td>
                                <td>{ user.createdAt.toLocaleString() }</td>
                                <td>
                                    {
                                        user.username === currentEditing?.username ?
                                        <SelectField options={roles} value={roleTags[currentEditing.role]} onChange={(e) => setCurrentEditing({
                                            ...currentEditing,
                                            role: roleMap[e.target.value as never]
                                        })}/>
                                        :
                                        roleNames[user.role] 
                                    }
                                </td>
                                <td>
                                    {
                                        user.username === currentEditing?.username ?
                                        <SelectField options={["yes", "no"]} value={currentEditing.verified ? "yes" : "no"} onChange={(e) => setCurrentEditing({
                                            ...currentEditing,
                                            verified: e.target.value === "yes"
                                        })}/>
                                        :
                                        user.verified ? "yes" : "no"
                                    }
                                </td>
                                <td className='options'>
                                    {
                                        user.username === currentEditing?.username ?
                                        <>
                                            <div className='option green' onClick={ saveUser }>
                                                <FaSave />
                                            </div>
                                            <div className='option red' onClick={ () => setCurrentEditing(undefined) }>
                                                <MdCancel />
                                            </div>
                                        </>
                                        :
                                        username !== user.username &&
                                        <>
                                            <div className='option orange' onClick={ () => setCurrentEditing({...user}) }>
                                                <MdEdit />
                                            </div>
                                            <div className='option red' onClick={ deleteUser }>
                                                <MdDelete />
                                            </div>
                                        </>
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}