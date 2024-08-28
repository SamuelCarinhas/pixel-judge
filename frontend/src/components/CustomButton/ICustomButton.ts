export interface ICustomButton {
    text: string
    color: IButtonColor
    onClick: React.MouseEventHandler<HTMLDivElement>
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
