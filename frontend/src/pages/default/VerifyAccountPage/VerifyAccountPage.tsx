import './VerifyAccountPage.css'
import { useEffect, useState } from 'react'
import Loading from '../../../components/Loading/Loading';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const REST_URL = import.meta.env.VITE_REST_URL

export default function VerifyAccountPage() {

    const [verified, setVerified] = useState(false);
    const [error, setError] = useState<boolean>(false);
    const [token, setToken] = useState<string | null>("");

    const [searchParams] = useSearchParams();

    useEffect(() => {
        setToken(searchParams.get("token"));
    }, []);

    useEffect(() => {
        if(!token) return;
        let instance = axios.create({
            headers: {
                "Authorization" : `Bearer ${token}`
            }
        })

        instance.post(`${REST_URL}/auth/verify-account`)
        .then(() => {setVerified(true); setError(false)})
        .catch(() => setError(true))
    }, [token]);

    return (
        <div className='verify-account-page'>
            {
                error ?
                <span className='verify-account-page-error'>Invalid or expired token</span>
                :
                verified ?
                <span className='verify-account-page-success'>Your account is verified! You can now sign in.</span>
                :
                <div className='verify-account-page-loading'>
                    <span>We're verifying your account. Please wait a moment.</span>
                    <Loading />
                </div>
            }
        </div>
    )
}