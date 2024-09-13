import './EditUserPage.css'
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../../../components/InputField/InputField';
import { FaRegUser } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';
import CustomButton from '../../../components/CustomButton/CustomButton';
import Loading from '../../../components/Loading/Loading';
import axiosInstance from '../../../utils/axios';
import { IAccount } from '../../../utils/models/profile.model';
import axios from 'axios';
import { BiImageAdd } from 'react-icons/bi';

type ProfileInput = {
    firstName: string
    lastName: string
    organization: string
    country: string
}

const REST_URL = import.meta.env.VITE_REST_URL

export default function EditUserPage() {

    const { username } = useContext(AuthContext);

    const [imageURL, setImageURL] = useState<string>("");

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<ProfileInput>();

    const onSubmit: SubmitHandler<ProfileInput> = async (data) => {
        try {
            await axiosInstance.put(`/profile`, data);
        } catch(error) {
            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof ProfileInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }
            return;
        }
    }

    function changePicture(e: React.ChangeEvent<HTMLInputElement>) {
        if(e.target.files === null || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const image = URL.createObjectURL(e.target.files[0]);
        
        axiosInstance.putForm('/profile/picture', {
            file
        }).then(() => {
            setImageURL(image);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        if(!username.length) return;

        axiosInstance.get(`/profile?username=${username}`).then((res) => {
            const account: IAccount = res.data.account;

            setValue("firstName", account.profile.firstName || "");
            setValue("lastName", account.profile.lastName || "");
            setValue("organization", account.profile.organization || "");
            setValue("country", account.profile.country || "");
        });

        setImageURL(`${REST_URL}/profile/picture?username=${username}`);
    }, [username]);

    return (
        <div className='edit-user-page'>
            <form className='user-info' onSubmit={ handleSubmit(onSubmit) }>
                <h2>Public Profile</h2>
                <InputField
                    description='First Name'
                    {...register("firstName")}
                    error={errors.firstName}
                    label='firstName'
                    icon={ <FaRegUser /> }
                    placeholder='First Name' />
                <InputField
                    description='Last Name'
                    {...register("lastName")}
                    error={errors.lastName}
                    label='lastName'
                    icon={ <FaRegUser /> }
                    placeholder='Second Name' />
                <InputField
                    description='Organization'
                    {...register("organization")}
                    error={errors.organization}
                    label='organization'
                    icon={ <HiOutlineBuildingOffice2 /> }
                    placeholder='Organization' />
                <InputField
                    description='Country'
                    {...register("country")}
                    error={errors.country}
                    label='country'
                    icon={ <HiOutlineLocationMarker /> }
                    placeholder='Country' />
                <CustomButton color={ IButtonColor.ORANGE } text='Save' />
                { errors.root && <span className='edit-user-page-error'>{ errors.root.message }</span> }
                {
                    isSubmitting &&
                    <Loading />
                }
            </form>
            <div className="image-upload">
                <label className="image" style={{ backgroundImage: `url(${imageURL})` }}>
                    <div className="show">
                        <BiImageAdd />
                        <input type="file" onChange={ changePicture } />
                    </div>
                </label>
            </div>
        </div>
    )
}
