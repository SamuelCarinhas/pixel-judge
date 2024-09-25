import { createContext, ReactNode, useEffect, useState } from "react";
import IAuthContext, { AuthRole } from "./IAuthContext.ts";
import { jwtDecode } from "jwt-decode";
import { roleMap } from "./IAuthContext.ts";
import axios from "axios";
import { io, Socket } from "socket.io-client";

type Props = {
    children?: ReactNode;
}

const initialValue = {
    role: AuthRole.LOADING,
    setRole: () => {},
    username: "",
    logout: () => {},
    authToken: null,
    refreshToken: null,
    login: () => {},
    socket: null,
    axiosInstance: axios.create({
        baseURL: import.meta.env.VITE_REST_URL
    })
}

const AuthContext = createContext<IAuthContext>(initialValue)

const REST_URL = import.meta.env.VITE_REST_URL;

const AuthProvider = ({ children }: Props) => {
    const [ role, setRole ] = useState<AuthRole>(initialValue.role);
    const [ username, setUsername ] = useState<string>("");
    const [ socket, setSocket ] = useState<Socket | null>(null);

    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_REST_URL
    })

    async function updateToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        let instance = axios.create({
            headers: {
                "Authorization" : `Bearer ${refreshToken}`
            }
        })

        const response = await instance.post(`${REST_URL}/auth/refresh-token`, {
            refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
    }

    async function connectSocketIO() {
        let authToken = localStorage.getItem('authToken');
        try {
            const newSocket = io(REST_URL, {
                auth: {
                    token: authToken
                }
            })

            setSocket(newSocket);

            newSocket.on('connect_error', async () => {
                await updateToken();
                const newToken = localStorage.getItem('authToken');
                if(newToken && newToken !== authToken) {
                    newSocket.auth = {
                        token: newToken
                    }
                    newSocket.connect();
                }
            })
        } catch(err) {
            logout();
        }

        return () => {
            if(socket) {
                socket.close();
            }
        }
    }

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if(!authToken || !refreshToken) {
            setRole(AuthRole.DEFAULT);
            return;
        }

        console.log('LOGIN');
        login(authToken, refreshToken);
    }, []);

    function logout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        if(socket) {
            socket.close();
            setSocket(null);
        }
        setRole(AuthRole.DEFAULT)
    }

    function login(authToken: string, refreshToken: string) {
        try {
            const decoded = jwtDecode(authToken) as never;
            const role = roleMap[decoded['role']];
            localStorage.setItem("authToken", authToken);
            localStorage.setItem("refreshToken", refreshToken);
            setUsername(decoded['user']);
            setRole(role);

            axiosInstance.interceptors.request.use(request => {
                const accessToken = localStorage.getItem('authToken');
                request.headers['Authorization'] = `Bearer ${accessToken}`;
                return request
            }, error => Promise.reject(error));

            axiosInstance.interceptors.response.use(
                response => {
                    console.log('RESPONSE', response)
                    return response
                },
                async error => {
                    const originalRequest = error.config;
                    if (error.response.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;
                        try {
                            await updateToken();

                            console.log('UPDATE TOKEN');

                            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

                            return axiosInstance(originalRequest);
                        } catch (refreshError) {
                            logout();
                        }
                    }
                    return Promise.reject(error);
                }
            );

            connectSocketIO();
        } catch(e) {
            logout();
        }
    }

    return (
        <AuthContext.Provider value={{ username, role, setRole, logout, login, socket, axiosInstance }}>
            { children }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }