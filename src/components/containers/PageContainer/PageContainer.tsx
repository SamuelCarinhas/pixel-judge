import './PageContainer.css';
import IPageContainer from "./IPageContainer.ts";
import Navbar from '../../Navbar/Navbar.tsx';
import Footer from '../../Footer/Footer.tsx';

export default function PageContainer(props: IPageContainer) {

    return (
        <div className="page-container">
            <Navbar />
            <div className='page-content'>
                {props.children}
            </div>
            <Footer />
        </div>
    )
}
