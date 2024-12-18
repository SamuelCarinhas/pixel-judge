import './HomeSectionCard.css'

interface HomeSectionCardProps {
    title: string
    description: string
}

export default function HomeSectionCard(props: HomeSectionCardProps) {
    return (
        <div className="w-[23rem] h-44 from-[#2F2F2F] from-60% to-60% to-[#333333] bg-gradient-to-br rounded-xl p-3">
            <div className="flex flex-row justify-between h-full">
                <div className="flex flex-col w-2/3 h-full justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold text-white"> { props.title } </h1>
                        <span className="text-[#cccccc]"> { props.description } </span>
                    </div>
                    <div className="bg-[#FF8800] w-fit text-sm pl-4 pr-4 rounded-xl text-white">
                        Join
                    </div>
                </div>
                <div className="flex items-center justify-center w-16 h-16 relative flex-grow-0 z-10 text-black
                    before:-z-10 before:absolute before:w-full before:h-full before:bg-[#FF880013] before:rounded-full
                    after:-z-10 after:absolute after:w-full after:h-full after:rounded-full percentage
                    ">
                    <span className="w-14 h-14 flex justify-center items-center bg-[#333] rounded-full text-[#ccc]">
                        16%
                    </span>
                </div>
            </div>
        </div>
    )
}
