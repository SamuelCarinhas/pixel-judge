export interface IAccount {
    username: string,
    role: string,
    profile: {
        firstName: string | null,
        lastName: string | null,
        birthDate: Date | null,
        country: string | null,
        city: string | null,
        organization: string | null,
        lastVisit: Date | null,
        registered: Date
        online: Boolean
    }
    followers: number,
    following: number
}
