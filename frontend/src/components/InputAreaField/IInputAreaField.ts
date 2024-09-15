import { ReactNode } from "react";
import { FieldError } from "react-hook-form";

export interface IInputAreaField extends React.InputHTMLAttributes<HTMLTextAreaElement> {
    icon: ReactNode;
    label: string;
    rows?: number;
    description?: string;
    error?: FieldError | undefined;
}
