export enum AlertType {
    DEFAULT,
    INFO,
    DANGER,
    SUCCESS,
    WARNING
}

export interface IAlert {
    type: AlertType
    text: string
    title: string
    id?: string
    duration?: number
    slideUp?: boolean
    fadeOut?: boolean
}

export default interface IAlertContext {
    alerts: IAlert[]
    addAlert: (alert: IAlert) => void
}
