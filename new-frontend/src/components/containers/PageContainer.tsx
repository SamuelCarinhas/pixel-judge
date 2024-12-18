import { ReactNode } from "react"
import Navbar from "../Navbar"
import Footer from "../Footer"

interface PageContainerProps {
    children?: ReactNode
}

export default function PageContainer(props: PageContainerProps) {
    return (
        <div className="landing-page font-outfit flex w-full flex-col bg-[#F9FAFB] dark:bg-[#252525] items-center overflow-hidden">
            <Navbar />

            {
                props.children
            }

            <Footer />
        </div>
    )
}