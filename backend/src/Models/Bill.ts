
import { BillEnum } from "../Enums/BillEnum"
import BillInstallment from "./BillInstallment"

type BillType = {
    biilId?: number
    userId: number
    billType: BillEnum
    description: string
    value: number
    installmentsQuantity: number
    installments: BillInstallment[]
    paymentDay: number
    firstDueDate: string
    createdAt: string
    isCanceled: boolean
    canceledAt?: string
}

export default class Bill {
    private biilId?: number
    private userId: number
    private billType: BillEnum
    private description: string
    private value: number
    private installmentsQuantity: number
    private installments: BillInstallment[]
    private paymentDay: number
    private firstDueDate: string
    private createdAt: string
    private isCanceled: boolean
    private canceledAt?: string

    constructor(params: BillType){
        this.biilId = params.biilId
        this.userId = params.userId
        this.billType = params.billType
        this.description = params.description
        this.value = params.value
        this.installmentsQuantity = params.installmentsQuantity
        this.installments = params.installments
        this.paymentDay = params.paymentDay
        this.firstDueDate = params.firstDueDate
        this.createdAt = params.createdAt
        this.isCanceled = params.isCanceled
        this.canceledAt = params.canceledAt
    }
}