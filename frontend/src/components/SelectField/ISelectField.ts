import React from "react";

export interface ISelectFields extends React.InputHTMLAttributes<HTMLSelectElement> {
    options: string[]
}