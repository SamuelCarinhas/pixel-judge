export interface IAdminProblem {
    id: string
    title: string

    timeLimit: number
    memoryLimit: number

    problemDescription: string
    inputDescription: string
    outputDescription: string
    restrictions: string

    public: boolean
}