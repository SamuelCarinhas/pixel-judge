import { ReactNode } from "react";

interface ValueCardProps {
    title: string,
    body: string,
    icon?: ReactNode
}

export default function ValueCard(props: ValueCardProps) {

    return (
        <div className="flex flex-col gap-3 p-4 drop-shadow-[0_0_0.8px#ccc] dark:drop-shadow-[0_0_0.8px#333333] rounded-xl bg-white dark:bg-[#222222]">
            <div className="flex flex-row items-center gap-4">
                <div className="flex w-12 h-12 bg-[#ff88005f] rounded-xl items-center justify-center text-[#ff8800] text-2xl">
                    { props.icon }
                </div>
                <span className="text-xl font-medium capitalize dark:text-white">{ props.title }</span>
            </div>
            <div className="text-[#666] dark:text-[#ccc] text-justify">
                <span>{ props.body }</span>
            </div>
        </div>
    )
}