export interface ISubmission {
    id: string
    author: {
        username: string
    }
    problem: {
        id: string
    }
    status: string
    verdict: string
    details: string
    createdAt: Date
    updatedAt: Date
}