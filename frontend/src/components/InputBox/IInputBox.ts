import { FieldError } from "react-hook-form";

export interface IInputBox extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    description?: string;
    error?: FieldError | undefined;
}
