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

export type BillType = {
    biilId: number,
    userId: number,
    billType: keyof typeof BillEnum,
    billTypeDescription: BillEnum,
    categoryKey: keyof typeof SpendingCategoryEnum,
    categoryDescription: SpendingCategoryEnum,
    description: string,
    paymentDay: number,
    createdAt: string,
    isCanceled: boolean,
    installments: [{
        installmentId: number,
        billId: number,
        installmentNumber: number,
        value: number,
        dueDate: string,
        isPayed: boolean,
        createdAt: string,
        isExpired: boolean
    }]
}

export type CreateBillType = {
    message: string,
    bill: BillType
}