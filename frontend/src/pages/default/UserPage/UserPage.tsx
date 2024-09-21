import { Link, useParams } from 'react-router-dom'
import './UserPage.css'
import { useContext, useEffect, useState } from 'react';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { IAccount } from '../../../utils/models/profile.model';

import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";

import CustomButton from '../../../components/CustomButton/CustomButton';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole, roleColors, roleMap, roleNames } from '../../../context/AuthContext/IAuthContext';
import axiosInstance from '../../../utils/axios';
import { ISubmission } from '../../../utils/models/submission.model';

const REST_URL = import.meta.env.VITE_REST_URL

export default function UserPage() {

    const [submissions, setSubmissions] = useState<ISubmission[]>([]);

    const authContext = useContext(AuthContext);

    const { username } = useParams();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [account, setAccount] = useState<IAccount>({
        username: "",
        role: "",
        profile: {
            firstName: null,
            lastName: null,
            birthDate: null,
            country: null,
            city: null,
            organization: null,
            lastVisit: null,
            registered: new Date()
        },
        followers: 0,
        following: 0
    });

    function updateAccount(account: IAccount) {
        if(account.profile.birthDate !== null) account.profile.birthDate = new Date(account.profile.birthDate);
        if(account.profile.lastVisit !== null) account.profile.lastVisit = new Date(account.profile.lastVisit);
        account.profile.registered = new Date(account.profile.registered);
        setAccount(account);
    }

    function fetchAccount(username: string) {
        axiosInstance.get(`${REST_URL}/profile?username=${username}`)
        .then(res => updateAccount(res.data.account))
        .catch(() => setNotFound(true));
    }

    useEffect(() => {
        if(!username) setNotFound(true);

        fetchAccount(username as string);

        axiosInstance.get(`/submission/user?username=${username}`)
        .then(res => {
            const submissions = res.data.submissions as ISubmission[]
            submissions.map(submission => submission.createdAt = new Date(submission.createdAt))
            submissions.map(submission => submission.updatedAt = new Date(submission.updatedAt))
            setSubmissions(submissions);
        })
        .catch(() => {});
    }, [username]);

    useEffect(() => {
        if(account.username.length === 0) return;
        if(authContext.role === AuthRole.LOADING || authContext.role === AuthRole.DEFAULT) return;

        axiosInstance.get(`${REST_URL}/profile/is-following?username=${username}`)
        .then(res => setIsFollowing(res.data.following))
        .catch(() => setIsFollowing(false));
    }, [account, authContext.role]);

    function follow() {
        axiosInstance.post(`${REST_URL}/profile/follow?username=${username}`)
        .then(() => fetchAccount(username as string))
    }

    function unfollow() {
        axiosInstance.delete(`${REST_URL}/profile/unfollow?username=${username}`)
        .then(() => fetchAccount(username as string))
    }

    return (
        notFound ?
            <NotFoundPage />
        :
        <div className='user-page'>
            <div className='user-info'>
                <div className='user'>
                    <img src={account.username ? `${REST_URL}/profile/picture?username=${account.username}` : ""}/>
                    <div className='user-id'>
                        <span className={`rank ${roleColors[roleMap[account.role as never]]}`}> { roleNames[roleMap[account.role as never]] } </span>
                        <span className={`username ${roleColors[roleMap[account.role as never]]}`}>@{username}</span>
                        <span className='full-name'>{account.profile.firstName} {account.profile.lastName}</span>
                    </div>
                </div>
                {authContext.username.toLocaleLowerCase() === username?.toLocaleLowerCase() ?
                    <Link to="/settings/profile">
                        <CustomButton text="Edit Profile" color={IButtonColor.ORANGE}></CustomButton>
                    </Link>
                    :
                    isFollowing ?
                    <CustomButton text="Unfollow" color={IButtonColor.ORANGE} onClick={ unfollow }></CustomButton>
                    :
                    <CustomButton text="Follow" color={IButtonColor.ORANGE} onClick={ follow }></CustomButton>
                }
                <div className='social'>
                    <FaUserFriends /> <span>{account.followers} Followers</span> <span>{account.following} Following</span>
                </div>
                <div className='information'>
                    <h3>Information</h3>
                    <span><HiOutlineBuildingOffice2 /> {account.profile.organization}</span>
                    <span><HiOutlineLocationMarker /> {account.profile.country}</span>
                </div>
                <div className='badges'>
                    <h3>Badges</h3>
                    <div className='list'>
                        <img src={"https://images.credly.com/images/519219f0-1969-4815-8af3-f8e4bda2b565/Beta_Tester_-__Accreditation_Badge__1_.png"}></img>
                    </div>
                </div>
            </div>
            <div className='user-activity'>
                <h2>Submissions</h2>
                <div className='submissions'>
                    <table>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Submitted</th>
                                <th>Problem</th>
                                <th>Verdict</th>
                            </tr>
                            {
                                submissions.map((submission, key) => (
                                    <tr key={key}>
                                        <th className='id'><Link to={`/submission/${submission.id}`}>{submission.id}</Link></th>
                                        <th className='submitted'>{submission.createdAt.toLocaleString()}</th>
                                        <th className='problem'><Link to={`/problem/${submission.problem.id}`}>#{submission.problem.id}</Link></th>
                                        <th className={`verdict ${submission.verdict === 'Accepted' ? 'green' : 'red'}`}>{submission.verdict}</th>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
