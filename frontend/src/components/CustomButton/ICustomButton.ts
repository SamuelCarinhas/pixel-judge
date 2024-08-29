export interface ICustomButton {
    text: string
    color: IButtonColor
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    type?: string | undefined
    disabled?: boolean
}

export enum IButtonColor {
    GREEN,
    ORANGE,
    BLUE
}

export const buttonColorMap = {
    [IButtonColor.GREEN]: 'button-green',
    [IButtonColor.ORANGE]: 'button-orange',
    [IButtonColor.BLUE]: 'button-blue',
}
