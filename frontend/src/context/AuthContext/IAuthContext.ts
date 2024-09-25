import { AxiosInstance } from "axios";
import { Socket } from "socket.io-client";

export enum AuthRole {
    LOADING,
    DEFAULT,
    USER,
    MODERATOR,
    ADMIN
}

export default interface IAuthContext {
    role: AuthRole;
    setRole: (value: AuthRole) => void;
    username: string;
    socket: Socket | null;
    logout: () => void;
    login: (authToken: string, refreshToken: string) => void;
    axiosInstance: AxiosInstance;
}

export const roleMap = {
    "LOADING": AuthRole.LOADING,
    "DEFAULT": AuthRole.DEFAULT,
    "USER": AuthRole.USER,
    "MODERATOR": AuthRole.MODERATOR,
    "ADMIN": AuthRole.ADMIN
}

export const roleNames = {
    [AuthRole.LOADING]: "Loading",
    [AuthRole.DEFAULT]: "Default",
    [AuthRole.USER]: "User",
    [AuthRole.MODERATOR]: "Moderator",
    [AuthRole.ADMIN]: "Administrator"
}

export const roleTags = {
    [AuthRole.LOADING]: "ERROR",
    [AuthRole.DEFAULT]: "ERROR",
    [AuthRole.USER]: "USER",
    [AuthRole.MODERATOR]: "MODERATOR",
    [AuthRole.ADMIN]: "ADMIN"
}

export const roleColors = {
    [AuthRole.LOADING]: "black",
    [AuthRole.DEFAULT]: "black",
    [AuthRole.USER]: "gray",
    [AuthRole.MODERATOR]: "green",
    [AuthRole.ADMIN]: "red"
}
