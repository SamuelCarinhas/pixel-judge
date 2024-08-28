import './NotFoundPage.css'
import notfound from '../../../assets/gifs/404.gif'

export default function NotFoundPage() {

    return (
        <div className='notfound-page'>
            <span className='primary'>404</span>
            <span>We couldn't find the page you are looking for.</span>
            <img src={notfound}></img>
        </div>
    )
}