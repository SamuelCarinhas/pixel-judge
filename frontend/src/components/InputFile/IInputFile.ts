import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

export interface IInputFile extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: ReactNode;
    label: string;
    description?: string;
    error?: FieldError | undefined;
}
