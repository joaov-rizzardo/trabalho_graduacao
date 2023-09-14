import { BillEnum, SpendingCategoryEnum } from "../CategoryTypes"

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