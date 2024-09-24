import { ReactNode } from "react";

export default interface IPagedContainer<T> {
    children?: ReactNode
    restPath: string
    title?: string
    setValues: React.Dispatch<React.SetStateAction<T[]>>
}
