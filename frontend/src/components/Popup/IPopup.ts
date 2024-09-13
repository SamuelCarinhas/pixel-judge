import React, { ReactNode } from "react";

export default interface IPopup {
    title: string
    children?: ReactNode
    onClose: React.MouseEventHandler<HTMLDivElement>
}