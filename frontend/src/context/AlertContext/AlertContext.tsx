import {createContext, ReactNode, useState} from "react";
import IAlertContext, {IAlert} from "./IAlertContext.ts";

type Props = {
    children?: ReactNode;
}

const initialValue = {
    alerts: [],
    addAlert: () => {}
}

const AlertContext = createContext<IAlertContext>(initialValue)


function randomString() {
    let string = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < 20; i++) {
        string += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return string;
}

const AlertProvider = ({ children }: Props) => {
    const [ alerts, setAlerts ] = useState<IAlert[]>(initialValue.alerts);

    function addAlert(alert: IAlert) {
        const id = Date.now().toString() + randomString();
        alert.id = id;
        alert.slideUp = true;
        setAlerts(prevAlerts => [...prevAlerts, alert]);
        setTimeout(() => {
            setAlerts((prevAlerts) => prevAlerts.map(a => a.id === id ? { ...a, slideUp: false } : a))
        }, 500)
        setTimeout(() => {
            setAlerts((prevAlerts) => prevAlerts.map(a => a.id === id ? { ...a, fadeOut: true } : a))
            setTimeout(() => {
                setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== id))
            }, 500)
        }, alert.duration || 3000)
    }

    return (
        <AlertContext.Provider value={{ alerts, addAlert }}>
            { children }
        </AlertContext.Provider>
    )
}

export { AlertContext, AlertProvider }