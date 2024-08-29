import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

export interface IInputField extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: ReactNode;
    label: string;
    error?: FieldError | undefined;
}
