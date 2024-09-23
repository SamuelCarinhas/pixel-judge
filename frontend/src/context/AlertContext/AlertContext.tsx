import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import IAlertContext, {AlertType, IAlert} from "./IAlertContext.ts";
import { AuthContext } from "../AuthContext/AuthContext.tsx";

type Props = {
    children?: ReactNode;
}

const initialValue = {
    alerts: [],
    addAlert: () => {}
}

const AlertContext = createContext<IAlertContext>(initialValue)

interface ISocketAlert {
    type: string,
    text: string,
    title: string
}

function parseSocketAlert(alert: ISocketAlert): IAlert {
    const map = {
        'DEFAULT': AlertType.DEFAULT,
        'INFO': AlertType.INFO,
        'DANGER': AlertType.DANGER,
        'SUCCESS': AlertType.SUCCESS,
        'WARNING': AlertType.WARNING
    }
    return {
        type: map[alert.type.toUpperCase() as never],
        text: alert.text,
        title: alert.title,
    }
}

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
    const { socket } = useContext(AuthContext);

    useEffect(() => {
        if(socket === null) return;
        socket.on('alert', (socketAlert: ISocketAlert ) => {
            addAlert(parseSocketAlert(socketAlert));
        });
    }, [socket])

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