import './ForumPage.css'
import { useContext, useEffect, useState } from 'react'
import { IPost } from '../../../utils/models/post.model'
import axiosInstance from '../../../utils/axios';
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../context/AuthContext/IAuthContext';
import { Link } from 'react-router-dom';
import CustomButton from '../../../components/CustomButton/CustomButton';
import { IButtonColor } from '../../../components/CustomButton/ICustomButton';
import MarkdownContainer from '../../../components/containers/MarkdownContainer/MarkdownContainer';
import { FaHeart } from 'react-icons/fa';
import { IoChatbox } from 'react-icons/io5';

const REST_URL = import.meta.env.VITE_REST_URL

export default function ForumPage() {

    const [posts, setPosts] = useState<IPost[]>([]);
    const { role, username } = useContext(AuthContext);

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

    function likePost(index: number) {
        if(role === AuthRole.LOADING || role === AuthRole.DEFAULT) return;
        const post = posts[index];
        const likeIndex = post.likes.findIndex(like => like.profile.account.username.toLowerCase() === username.toLowerCase());
        const cpyPosts = [...posts];
        if(likeIndex === -1) {
            axiosInstance.post(`/post/like?id=${post.id}`).then(() => {
                cpyPosts[index].likes.push({
                    profile: {
                        account: {
                            username
                        }
                    }
                });
                setPosts(cpyPosts);
            })
        } else {
            axiosInstance.post(`/post/unlike?id=${post.id}`).then(() => {
                cpyPosts[index].likes = cpyPosts[index].likes.filter(like => like.profile.account.username !== username);
                setPosts(cpyPosts);
            })
        }
    }

    return (
        <div className='forum-page'>
            {
                role !== AuthRole.LOADING && role !== AuthRole.DEFAULT &&
                <Link to={'/forum/new-post'}>
                    <CustomButton color={IButtonColor.GREEN} text='New Post' />
                </Link>
            }
            {posts.map((post, index) => (
                <div className='post' key={index}>
                    <span className='title'> { post.title } </span>
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
                        <span onClick={ () => likePost(index) } className={`like ${post.likes.findIndex(like => like.profile.account.username.toLowerCase() === username.toLowerCase()) !== -1 ? 'active' : ''}`}><FaHeart /> { post.likes.length } Likes</span>
                        <Link to={`/forum/${post.id}`}><IoChatbox /> { post.comments.length } Comments</Link>
                    </div>
                </div>
            ))
            }
        </div>
    )
}