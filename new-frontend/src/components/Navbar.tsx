import logo from '../assets/images/logo.png'

export default function Navbar() {
    
    return (
        <div className="flex w-full h-16 bg-white dark:bg-[#222222] items-center justify-center">
            <div className='flex w-full items-cente justify-between pr-10 pl-10 max-w-7xl'>
                <div className="flex flex-row gap-2 items-center justify-center">
                    <img src={ logo } className='h-8'></img>
                    <span className='font-bold text-4xl dark:text-[#ccc]'>PixelJudge</span>
                </div>
                <div className='flex bg-orange-500 p-1 pl-3 pr-3 text-white rounded-full items-center justify-center'>
                    <span>Sign In</span>
                </div>
            </div>
        </div>
    )
}