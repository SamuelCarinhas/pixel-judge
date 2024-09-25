export interface IPost {
    id: string,
    homePage: boolean,
    createdAt: Date,
    updatedAt: Date,
    profile: {
        imagePath: string,
        account: {
            username: string
        }
    }
    likes: [
        {
            profile: {
                account: {
                    username: string
                }
            }
        }
    ]
    comments: [
        {
            profile: {
                imagePath: string,
                account: {
                    username: string
                }
            }
            createdAt: Date,
            updatedAt: Date
        }
    ]
}