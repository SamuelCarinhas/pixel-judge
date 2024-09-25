import { useContext, useEffect, useState } from 'react'
import './AdminLogsPage.css'
import { AuthContext } from '../../../context/AuthContext/AuthContext';
import { AuthRole } from '../../../context/AuthContext/IAuthContext';

interface ILog {
    author: {
        username: string
    }
    createdAt: Date
    text: string
    type: 'INFO' | 'ADMIN'
}

const colorType = {
    'INFO': 'blue',
    'ADMIN': 'red'
}

export default function AdminLogsPage() {

    const { role, axiosInstance } = useContext(AuthContext);

    const [logs, setLogs] = useState<ILog[]>([]);

    useEffect(() => {
        if(role !== AuthRole.ADMIN) return;

        axiosInstance.get('/admin/logs')
            .then(res => {
                const logs = res.data.logs as ILog[]
                logs.map(log => log.createdAt = new Date(log.createdAt))
                setLogs(logs)
            })
    }, [role]);

    return (
        <div className='admin-logs'>
            <h3>Logs</h3>
            <div className='logs'>
                {
                    logs.map((log, idx) => (
                        <div className='log' key={ idx }>
                            <div className='header'>
                                <span className={colorType[log.type]}>{ log.type }</span>
                                <span>{ `${log.createdAt.toLocaleDateString()} ${log.createdAt.toLocaleTimeString()}` }</span>
                            </div>
                            <span>{ log.text }</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}