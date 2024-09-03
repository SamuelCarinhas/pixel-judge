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
    username: string
    logout: () => void;
    login: (authToken: string, refreshToken: string) => void;
}

export const roleMap = {
    "LOADING": AuthRole.LOADING,
    "DEFAULT": AuthRole.DEFAULT,
    "USER": AuthRole.USER,
    "MOD": AuthRole.MOD,
    "ADMIN": AuthRole.ADMIN
}

export const roleNames = {
    [AuthRole.LOADING]: "Loading",
    [AuthRole.DEFAULT]: "Default",
    [AuthRole.USER]: "User",
    [AuthRole.MOD]: "Moderator",
    [AuthRole.ADMIN]: "Administrator"
}

export const roleColors = {
    [AuthRole.LOADING]: "black",
    [AuthRole.DEFAULT]: "black",
    [AuthRole.USER]: "gray",
    [AuthRole.MOD]: "green",
    [AuthRole.ADMIN]: "red"
}
