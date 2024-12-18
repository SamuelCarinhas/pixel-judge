import { FaGraduationCap } from "react-icons/fa";
import ValueCard from "../components/cards/ValueCard";
import { IoMdTime } from "react-icons/io";
import { RiAuctionFill } from "react-icons/ri";
import { MdSecurity } from "react-icons/md";
import AnimatedCanvas from "../components/AnimatedCanvas";
import PageContainer from "../components/containers/PageContainer";

export default function LandingPage() {

    return (
        <PageContainer>
            <section className='relative flex w-full items-center justify-center bg-white dark:bg-[#222222]'>
                <AnimatedCanvas />
                <div className='z-10 pr-10 pl-10 max-w-7xl flex flex-col items-center justify-center gap-5 min-h-[30rem] h-[70dvh] max-h-[50rem] w-full'>
                    <span className='text-4xl font-bold relative bg-gradient-to-l from-[#FFD859] to-[#FF8800] bg-clip-text text-transparent capitalize text-center'>Sharpen Your Skills, Pixel By Pixel</span>
                    <div className='absolute ml-[40rem] mb-28 h-32 w-32 rounded-tl-[70%] rounded-tr-[40%] rounded-bl-[40%] rounded-br-[70%] bg-gradient-to-b from-[#FFD859] to-[#FF8800] blur-[6rem]'></div>
                    <span className='capitalize text-[#666] dark:text-[#ccc] max-w-xl text-center'>coding arena where each challenge hones your skills. Dive in, compete, and watch your problem-solving sharpen with every solution.</span>
                    <div className='absolute mr-[40rem] mt-28 h-32 w-32 rounded-tl-[40%] rounded-tr-[80%] rounded-bl-[90%] rounded-br-[40%] bg-gradient-to-t from-[#FFD859] to-[#FF8800] blur-[6rem]'></div>
                </div>
            </section>

            <section className="flex w-full items-center justify-center pt-32 pb-32 bg-[#F9FAFB] dark:bg-[#252525] shadow-inner">
                <div className="pr-10 pl-10 max-w-7xl w-full grid md:grid-cols-2 gap-x-20 gap-y-10 justify-between">
                    <ValueCard title="Education and collaboration" icon={<FaGraduationCap />} body="
                        Instructors and students can set up custom challenges, track performance,
                        and learn together. Our platform is perfect for both self-paced practice
                        and classroom competitions." />
                    <ValueCard title="Real-time code evaluation" icon={<IoMdTime />} body="
                        Experience the thrill of competitive programming with immediate feedback
                        on your solutions. Our online judge evaluates your code against multiple
                        test cases in real-time, giving you insights into both your accuracy and
                        efficiency." />
                    <ValueCard title="Custom evaluators" icon={<RiAuctionFill />} body="
                        challenge creators define the rules. From traditional algorithmic
                        problems to AI-driven and heuristic-based contests, our flexible
                        evaluation system supports a wide range of competition styles,
                        empowering creators to innovate and participants to excel in diverse
                        challenges." />
                    <ValueCard title="Sandbox Security" icon={<MdSecurity />} body="
                        We prioritize your experience and safety. Each submission is securely
                        sandboxed to ensure resource constraints, time limits, and restricted access,
                        giving you a professional-grade testing environment similar to real-world competitions." />
                </div>
            </section>
        </PageContainer>
    )
}
