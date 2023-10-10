import { UserFinance } from "../UserType"
import { GetUserFinanceType, GetUserLevelType } from "./ProfileTypes"

export type GetGoalType = {
    goalId: number,
    userId: number,
    description: string,
    value: number,
    progressValue: number,
    createdAt: string,
    isCanceled: boolean,
    isCompleted: boolean
}

export type InvestGoalType = {
    message: string,
    goal: GetGoalType,
    rewards: {
        xp: number,
        points: number
    },
    userLevel: GetUserLevelType,
    userFinance: UserFinance
}

export type CreateGoalResponse = {
    message: string
    goal: GetGoalType
}

export type RecoverInvestmentsResponse = {
    message: string,
    goal: GetGoalType,
    userFinance: GetUserFinanceType
}