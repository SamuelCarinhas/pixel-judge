import { useParams } from 'react-router-dom'
import './UserPage.css'
import { useContext, useEffect, useState } from 'react';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import axios from 'axios';
import { IProfile } from '../../../utils/models/profile.model';

import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaUserFriends } from "react-icons/fa";

import CustomButton from '../../../components/CustomButton/CustomButton';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';
import { AuthContext } from '../../../context/AuthContext/AuthContext';

const REST_URL = import.meta.env.VITE_REST_URL

export default function UserPage() {

    const authContext = useContext(AuthContext);

    const { username } = useParams();
    const [notFound, setNotFound] = useState<boolean>(false);
    const [profile, setProfile] = useState<IProfile>({
        firstName: null,
        secondName: null,
        birthDate: null,
        country: null,
        city: null,
        organization: null,
        lastVisit: null,
        registered: new Date()
    });

    function updateProfile(profile: IProfile) {
        if(profile.birthDate !== null) profile.birthDate = new Date(profile.birthDate);
        if(profile.lastVisit !== null) profile.lastVisit = new Date(profile.lastVisit);
        profile.registered = new Date(profile.registered);
        setProfile(profile);
    }

    useEffect(() => {
        if(!username) setNotFound(true);

        axios.get(`${REST_URL}/profile?username=${username}`)
        .then(res => updateProfile(res.data.profile))
        .catch(() => setNotFound(true));
    }, [username]);

    return (
        notFound ?
        <NotFoundPage />
        :
        <div className='user-page'>
            <div className='user-info'>
                <div className='user'>
                    <img src={"https://image.winudf.com/v2/image1/Y29tLmthbmZvLmZ1bm55cHJvZmlsZXBpY3R1cmVfc2NyZWVuXzBfMTY3NzM3MzY0NV8wNzQ/screen-0.jpg?fakeurl=1&type=.jpg"}/>
                    <div className='user-id'>
                        <span className='rank'>Unranked</span>
                        <span className='username'>@{username}</span>
                        <span className='full-name'>{profile.firstName} {profile.secondName}</span>
                    </div>
                </div>
                {authContext.username.toLocaleLowerCase() === username?.toLocaleLowerCase() ?
                    <CustomButton text="Edit Profile" color={IButtonColor.ORANGE}></CustomButton>
                    :
                    <CustomButton text="Follow" color={IButtonColor.ORANGE}></CustomButton>
                }
                <div className='social'>
                    <FaUserFriends /> <span>0 Followers</span> <span>0 Following</span>
                </div>
                <div className='information'>
                    <h3>Information</h3>
                    <span><HiOutlineBuildingOffice2 /> {profile.organization}</span>
                    <span><HiOutlineLocationMarker /> {profile.country}</span>
                </div>
                <div className='badges'>
                    <h3>Badges</h3>
                    <div className='list'>
                        <img src={"https://images.credly.com/images/519219f0-1969-4815-8af3-f8e4bda2b565/Beta_Tester_-__Accreditation_Badge__1_.png"}></img>
                    </div>
                </div>
            </div>
            <div className='user-activity'>

            </div>
        </div>
    )
}
