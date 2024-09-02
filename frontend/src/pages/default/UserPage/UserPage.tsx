import { useParams } from 'react-router-dom'
import './UserPage.css'
import { useEffect, useState } from 'react';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import axios from 'axios';
import { IProfile } from '../../../utils/models/profile.model';

const REST_URL = import.meta.env.VITE_REST_URL

export default function UserPage() {

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
                    <img src={"https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg"}/>
                    <div className='user-id'>
                        <span className='rank'>Administrator</span>
                        <span className='username'>@carinhas</span>
                        <span className='full-name'>Samuel Carinhas</span>
                    </div>
                </div>
                <div className='information'>
                    <h3>Information</h3>
                    <span>University</span>
                    <span>Location</span>
                </div>
                <div className='badges'>
                    <h3>Badges</h3>
                </div>
            </div>
            <div className='user-activity'>
            </div>
        </div>
    )
}
