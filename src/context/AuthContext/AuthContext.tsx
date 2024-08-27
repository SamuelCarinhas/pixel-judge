import { createContext, ReactNode, useEffect, useState } from "react";
import IAuthContext, { AuthRole } from "./IAuthContext.ts";
import { jwtDecode } from "jwt-decode";
import { roleMap } from "./IAuthContext.ts";

type Props = {
    children?: ReactNode;
}

const initialValue = {
    role: AuthRole.LOADING,
    setRole: () => {},
    logout: () => {},
    authToken: null,
    refreshToken: null,
    login: () => {}
}

const AuthContext = createContext<IAuthContext>(initialValue)

const AuthProvider = ({ children }: Props) => {
    const [ role, setRole ] = useState<AuthRole>(initialValue.role);

    useEffect(() => {
        const authToken = localStorage.getItem("authToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if(!authToken || !refreshToken) {
            setRole(AuthRole.DEFAULT);
            return;
        }
        login(authToken, refreshToken);
    }, []);

    function logout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        setRole(AuthRole.DEFAULT)
    }

    function login(_authToken: string, _refreshToken: string) {
        try {
            const decoded = jwtDecode(_authToken) as never;
            const role = roleMap[decoded['custom:role']];
            localStorage.setItem("authToken", _authToken);
            localStorage.setItem("refreshToken", _refreshToken);
            setRole(role);
        } catch(e) {
            logout();
        }
    }

    return (
        <AuthContext.Provider value={{ role, setRole, logout, login }}>
            { children }
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider }