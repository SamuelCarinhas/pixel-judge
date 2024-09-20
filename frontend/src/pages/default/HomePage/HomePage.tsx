import './HomePage.css'
import constructing from '../../../assets/gifs/construction.gif'

export default function HomePage() {

    return (
        <div className="home-page">
            This page is not ready yet, please go explore other ones
            <span>We are currently building this page</span>
            <img src={constructing}></img>
        </div>
    )
}