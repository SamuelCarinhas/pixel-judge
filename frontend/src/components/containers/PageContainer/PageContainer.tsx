import './PageContainer.css';
import IPageContainer from "./IPageContainer.ts";
import Navbar from '../../Navbar/Navbar.tsx';
import Footer from '../../Footer/Footer.tsx';
import { useContext } from 'react';
import { AlertContext } from '../../../context/AlertContext/AlertContext.tsx';
import { AlertType } from '../../../context/AlertContext/IAlertContext.ts';

export default function PageContainer(props: IPageContainer) {

    const { alerts } = useContext(AlertContext);

    const colors: { [key in AlertType]?: string } = {
        [AlertType.DEFAULT]: "gray",
        [AlertType.INFO]: "blue",
        [AlertType.SUCCESS]: "green",
        [AlertType.DANGER]: "red",
        [AlertType.WARNING]: "orange"
    }

    return (
        <div className="page-container">
            <Navbar />
            <div className='page-content'>
                {props.children}
            </div>
            <div className='alerts'>
                {alerts.map((alert, id) => (
                    <div
                        key={id}
                        className={`alert ${colors[alert.type]} ${alert.slideUp ? "animate-slide-up" : alert.fadeOut ? "animate-fade-out" : ""}`}
                        role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <div>
                            <span>{alert.title}</span> {alert.text}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    )
}
