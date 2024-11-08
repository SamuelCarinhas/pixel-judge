import { FaGithub, FaLinkedin } from 'react-icons/fa'
import logo from '../assets/images/logo.png'

export default function Footer() {
    return (
        <section className="relative flex w-full items-center justify-center bg-[#1F1F1F] text-[#ccc] mt-32">
            <div className="absolute bg-[#1F1F1F] w-[130vw] -top-32 h-32 rounded-tl-[100%] rounded-tr-[100%]
            text-[#ccc] flex items-center justify-center flex-col gap-1">
                <span className="text-lg font-bold uppercase">Made with love by</span>
                <span className="text-xl uppercase font-bold bg-gradient-to-l from-[#FFD859] to-[#FF8800] bg-clip-text text-transparent">Samuel Carinhas</span>
            </div>
            <div className="pr-10 pl-10 max-w-7xl w-full flex flex-col">
                <div className="pb-5 flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row gap-2 items-center justify-center">
                            <img src={ logo } className='h-8'></img>
                            <span className='font-bold text-4xl'>PixelJudge</span>
                        </div>
                        <span>Sharpen your skills, pixel by pixel</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#FF8800] uppercase">Follow Us</span>
                        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-end md:gap-1 text-xl">
                            <FaGithub />
                            <FaLinkedin />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="w-full flex flex-row items-center justify-between text-[#999] pt-5 pb-5">
                    <span>Copyright &#169; 2024 PixelJudge</span>
                    <div className="flex flex-row gap-8 items-center">
                        <span>Terms</span>
                        <span>Privacy Policy</span>
                    </div>
                </div>
            </div>
        </section>
    )
}