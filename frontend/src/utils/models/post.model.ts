export interface IPost {
    id: string,
    title: string,
    content: string,
    homePage: boolean,
    createdAt: Date,
    updatedAt: Date,
    profile: {
        account: {
            username: string
        }
    }
    likes:
        {
            profile: {
                account: {
                    username: string
                }
            }
        }[]
    comments:
        {
            profile: {
                account: {
                    username: string
                }
            }
            createdAt: Date,
            updatedAt: Date
        }[]
}