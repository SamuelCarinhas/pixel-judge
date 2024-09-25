import './PostPage.css'
import { useContext, useEffect, useState } from 'react'
import { IPost } from '../../../utils/models/post.model'
import axiosInstance from '../../../utils/axios';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../context/AuthContext/IAuthContext';
import { Link, useParams } from 'react-router-dom';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';
import MarkdownContainer from '../../../components/containers/MarkdownContainer/MarkdownContainer';
import { FaHeart } from 'react-icons/fa';
import { IoChatbox } from 'react-icons/io5';

const REST_URL = import.meta.env.VITE_REST_URL

export default function PostPage() {

    const { id } = useParams();

    const [post, setPost] = useState<IPost | undefined>(undefined);
    const { role, username } = useContext(AuthContext);

    useEffect(() => {
        axiosInstance.get(`/post?id=${id}`).then(res => {
            const post = res.data.post as IPost;

            post.createdAt = new Date(post.createdAt);
            post.updatedAt = new Date(post.updatedAt);
            post.comments.forEach(comment => {
                comment.createdAt = new Date(comment.createdAt);
                comment.updatedAt = new Date(comment.updatedAt);
            });

            setPost(post);
        });
    }, [id])

    function likePost() {
        if(!post) return;
        if(role === AuthRole.LOADING || role === AuthRole.DEFAULT) return;
        const likeIndex = post.likes.findIndex(like => like.profile.account.username.toLowerCase() === username.toLowerCase());
        const cpyPost = { ...post };
        if(likeIndex === -1) {
            axiosInstance.post(`/post/like?id=${post.id}`).then(() => {
                cpyPost.likes.push({
                    profile: {
                        account: {
                            username
                        }
                    }
                });
                setPost(cpyPost);
            })
        } else {
            axiosInstance.post(`/post/unlike?id=${post.id}`).then(() => {
                cpyPost.likes = cpyPost.likes.filter(like => like.profile.account.username !== username);
                setPost(cpyPost);
            })
        }
    }

    return (
        post === undefined ? <></>
        :
        <div className='forum-page'>
            <div className='post'>
                <div className='post-header'>
                    <div className='avatar'>
                        <img src={ `${REST_URL}/profile/picture?username=${post.profile.account.username}` }/>
                        <Link to={`/user/${post.profile.account.username}`}>@{post.profile.account.username}</Link>
                    </div>
                    <span>{ post.createdAt.toLocaleDateString() }</span>
                </div>
                <div className='post-content'>
                    <MarkdownContainer content={ post.content }/>
                </div>
                <div className='post-footer'>
                    <span onClick={ () => likePost() } className={`like ${post.likes.findIndex(like => like.profile.account.username.toLowerCase() === username.toLowerCase()) !== -1 ? 'active' : ''}`}><FaHeart /> { post.likes.length } Likes</span>
                    <Link to={`/forum/${post.id}`}><IoChatbox /> { post.comments.length } Comments</Link>
                </div>
            </div>
            <div className='comments'>
                This will be the comments
            </div>
        </div>
    )
}