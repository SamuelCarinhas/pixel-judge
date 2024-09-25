import { useContext } from 'react'
import MarkdownContainer from '../../../components/containers/MarkdownContainer/MarkdownContainer'
import './NewForumPost.css'
import InputAreaField from '../../../components/InputAreaField/InputAreaField';
import { SubmitHandler, useForm } from 'react-hook-form';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';
import Loading from '../../../components/Loading/Loading';
import InputField from '../../../components/InputField/InputField';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertContext } from '../../../context/AlertContext/AlertContext';
import { AlertType } from '../../../context/AlertContext/IAlertContext';
import { AuthContext } from '../../../context/AuthContext/AuthContext';

type CreatePostInput = {
    title: string
    content: string
}

export default function NewForumPost() {

    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting }
    } = useForm<CreatePostInput>();

    const content = watch('content');
    const title = watch('title');
    const { addAlert } = useContext(AlertContext);
    const { axiosInstance }= useContext(AuthContext);

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<CreatePostInput> = async (data) => {
        axiosInstance.post('/post', data).then(res => {
            addAlert({
                type: AlertType.SUCCESS,
                title: 'Success',
                text: 'Post created'
            })
            navigate(`/forum/${res.data.post.id}`);
        }).catch((error) => {
            if(!axios.isAxiosError(error)) {
                setError("root", { message: "This was not supposed to happen."});
                return;
            }
            
            if(error.response && error.response.data && error.response.data.description) {
                const errors = error.response.data.description;
                for (let [key, value] of Object.entries(errors)) {
                    setError(key as keyof CreatePostInput, { message: value as string });
                }
            } else {
                setError("root", { message: "The server failed to respond" });
            }

            throw error;
        })
    }

    return (
        <div className='new-forum-post'>
            <form className='post-data' onSubmit={ handleSubmit(onSubmit) }>
                <InputField
                    {...register('title', { required: 'Title is required' })}
                    error={errors.title}
                    label='title'
                    icon={<MdDriveFileRenameOutline />}
                    description='Title'
                    />
                <InputAreaField
                    {...register('content', { required: 'Content is requireed' })}
                    error={errors.content}
                    label='post-content'
                    icon={undefined}
                    rows={10}
                    description='Content'
                    />

                <CustomButton disabled={ isSubmitting } type='submit' color={ IButtonColor.GREEN } text='Post' />
                { errors.root && <span className='error'>{ errors.root.message }</span> }
                {
                    isSubmitting &&
                    <Loading />
                }
            </form>
            <div className='preview-post'>
                <h2>Preview { title }</h2>
                <MarkdownContainer content={ content }/>
            </div>
        </div>
    )
}