import { ReactNode } from "react"

export interface IInputField {
    placeholder: string
    icon: ReactNode
    type?: string | undefined
    error: string
    setError: React.Dispatch<React.SetStateAction<string>>
    value: React.MutableRefObject<string>
}
