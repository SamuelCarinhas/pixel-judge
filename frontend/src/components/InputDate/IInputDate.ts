import { FieldError } from "react-hook-form";

export interface IInputDate extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    description?: string;
    error?: FieldError | undefined;
}
