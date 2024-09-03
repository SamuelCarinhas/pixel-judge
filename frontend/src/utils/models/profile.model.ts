export interface IAccount {
    username: string,
    role: string,
    profile: {
        firstName: string | null,
        secondName: string | null,
        birthDate: Date | null,
        country: string | null,
        city: string | null,
        organization: string | null,
        lastVisit: Date | null,
        registered: Date
    }
    followers: number,
    following: number
}
