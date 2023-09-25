import { BillEnum, SpendingCategoryEnum } from "../CategoryTypes"
import { UserFinance } from "../UserType"
import { GetUserLevelType } from "./ProfileTypes"

export type GetInstallmentsType = {
    billId: number
    installmentId: number
    installmentNumber: number
    userId: number
    typeId: keyof typeof BillEnum
    categoryKey: keyof typeof SpendingCategoryEnum
    categoryDescription: SpendingCategoryEnum
    description: string
    value: number
    isPayed: boolean
    payedAt: string
    dueDate: string
}

export type PayInstallmentType = {
    message: string,
    installment: GetInstallmentsType,
    userFinance: UserFinance,
    userLevel: GetUserLevelType,
    rewards: {
        xp: number,
        points: number
    }
}