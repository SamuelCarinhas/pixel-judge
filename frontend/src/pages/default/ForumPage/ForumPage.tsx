import './ForumPage.css'
import { useContext, useEffect, useState } from 'react'
import { IPost } from '../../../utils/models/post.model'
import axiosInstance from '../../../utils/axios';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../context/AuthContext/IAuthContext';
import { Link } from 'react-router-dom';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';

export default function ForumPage() {

    const [posts, setPosts] = useState<IPost[]>([]);
    const { role } = useContext(AuthContext);

    useEffect(() => {
        axiosInstance.get('/post/all').then(res => {
            const posts = res.data.posts as IPost[];
            posts.forEach(post => {
                post.createdAt = new Date(post.createdAt);
                post.updatedAt = new Date(post.updatedAt);
                post.comments.forEach(comment => {
                    comment.createdAt = new Date(comment.createdAt);
                    comment.updatedAt = new Date(comment.updatedAt);
                });
            });

            setPosts(posts);
        });
    }, [])

    return (
        <div className='forum-page'>
            {
                role !== AuthRole.LOADING && role !== AuthRole.DEFAULT &&
                <Link to={'/forum/new-post'}>
                    <CustomButton color={IButtonColor.GREEN} text='New Post' />
                </Link>
            }
            Forum
        </div>
    )
}