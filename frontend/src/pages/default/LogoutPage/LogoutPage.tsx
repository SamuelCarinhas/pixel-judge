import { Navigate } from "react-router-dom";
import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext/AuthContext.tsx";
import { AuthRole } from "../../../context/AuthContext/IAuthContext.ts";

export default function LogoutPage() {

    const { role, logout } = useContext(AuthContext);

    const hasLoggedOut = useRef(role === AuthRole.DEFAULT);

    useEffect(() => {
        if(!hasLoggedOut.current) {
            logout();
        }
    }, []);

    return (
        <Navigate to={"/"}/>
    )
}
