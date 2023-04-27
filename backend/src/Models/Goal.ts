import GoalDAO from "../DAO/GoalDAO"

type GoalFieldsType = {
    goalId?: number
    userId: number
    description: string
    value: number
    progressValue: number
    createdAt: string
    isCanceled: boolean
    canceledAt?: string
    isCompleted: boolean
    completedAt?: string
}

export default class Goal {
    private goalId?: number
    private userId: number
    private description: string
    private value: number
    private progressValue: number
    private createdAt: string
    private isCanceled: boolean
    private canceledAt?: string
    private isCompleted: boolean
    private completedAt?: string
    private goalDAO: GoalDAO

    constructor(params: GoalFieldsType){
        this.goalId = params.goalId
        this.userId = params.userId
        this.description = params.description
        this.value = params.value
        this.progressValue = params.progressValue
        this.createdAt = params.createdAt
        this.isCanceled = params.isCanceled
        this.canceledAt = params.canceledAt
        this.isCompleted = params.isCompleted
        this.completedAt = params.completedAt
        this.goalDAO = new GoalDAO()
    }
}