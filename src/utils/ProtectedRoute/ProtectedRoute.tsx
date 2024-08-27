import IProtectedRoute from "./IProtectedRoute.ts";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext.tsx";
import { Navigate, Outlet } from "react-router-dom";
import { AuthRole } from "../../context/AuthContext/IAuthContext.ts";

export default function ProtectedRoute(props: IProtectedRoute) {
    const { role } = useContext(AuthContext);

    if(props.roles.includes(role))
        return <Outlet />

    return ( role !== AuthRole.LOADING && <Navigate to={"/unauthorized"} replace /> )
}
