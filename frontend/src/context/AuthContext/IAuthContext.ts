export enum AuthRole {
    LOADING,
    DEFAULT,
    USER,
    MOD,
    ADMIN
}

export default interface IAuthContext {
    role: AuthRole;
    setRole: (value: AuthRole) => void;
    logout: () => void;
    login: (authToken: string, refreshToken: string) => void;
}

export const roleMap = {
    "loading": AuthRole.LOADING,
    "default": AuthRole.DEFAULT,
    "user": AuthRole.USER,
    "mod": AuthRole.MOD,
    "admin": AuthRole.ADMIN
}

export const roleNames = {
    [AuthRole.LOADING]: "Loading",
    [AuthRole.DEFAULT]: "Default",
    [AuthRole.USER]: "User",
    [AuthRole.MOD]: "Mod",
    [AuthRole.ADMIN]: "Default"
}

export const roleColors = {
    [AuthRole.LOADING]: "black",
    [AuthRole.DEFAULT]: "black",
    [AuthRole.USER]: "gray",
    [AuthRole.MOD]: "green",
    [AuthRole.ADMIN]: "red"
}
