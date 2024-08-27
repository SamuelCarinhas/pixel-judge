import { AuthRole } from "../../context/AuthContext/IAuthContext.ts";

export default interface IProtectedRoute {
    roles: AuthRole[]
}
