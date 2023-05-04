
import BillDAO from "../DAO/BillDAO"
import { BillEnum } from "../Enums/BillEnum"
import getCurrentStringDatetime from "../Utils/DateUtils"
import BillInstallment from "./BillInstallment"

type BillType = {
    biilId?: number
    userId: number
    billType: keyof typeof BillEnum
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
    private billType: keyof typeof BillEnum
    private billTypeDescription: string
    private description: string
    private value: number
    private installmentsQuantity: number
    private installments: BillInstallment[]
    private paymentDay: number
    private firstDueDate: string
    private createdAt: string
    private isCanceled: boolean
    private canceledAt?: string
    private billDAO: BillDAO

    constructor(params: BillType){
        this.biilId = params.biilId
        this.userId = params.userId
        this.billType = params.billType
        this.billTypeDescription = BillEnum[params.billType]
        this.description = params.description
        this.value = params.value
        this.installmentsQuantity = params.installmentsQuantity
        this.installments = params.installments
        this.paymentDay = params.paymentDay
        this.firstDueDate = params.firstDueDate
        this.createdAt = params.createdAt
        this.isCanceled = params.isCanceled
        this.canceledAt = params.canceledAt
        this.billDAO = new BillDAO()
    }

    public async save(){
        if(this.isCreated()){
            await this.billDAO.updateBill({
                billId: this.biilId!,
                userId: this.userId,
                typeId: this.billType,
                description: this.description,
                value: this.value,
                installments: this.installmentsQuantity,
                paymentDay: this.paymentDay,
                firstDueDate: this.firstDueDate,
                createdAt: this.createdAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt
            })
        }else{
            this.biilId = await this.billDAO.insertBillAndReturnId({
                userId: this.userId,
                typeId: this.billType,
                description: this.description,
                value: this.value,
                installments: this.installmentsQuantity,
                paymentDay: this.paymentDay,
                firstDueDate: this.firstDueDate,
                createdAt: this.createdAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt
            })
        }
    }

    public isPayed(){
        let isPayed = true
        this.installments.forEach(installment => {
            if(!installment.isPaid){
                isPayed = false
            }
        })
        return isPayed
    }

    public cancel(){
        this.isCanceled = true
        this.canceledAt = getCurrentStringDatetime()
    }

    public convertToObject(){
        return {
            biilId: this.biilId,
            userId: this.userId,
            billType: this.billType,
            billTypeDescription: this.billTypeDescription,
            description: this.description,
            value: this.value,
            installmentsQuantity: this.installmentsQuantity,
            installments: this.installments.map(installment => installment.convertToObject()),
            paymentDay: this.paymentDay,
            firstDueDate: this.firstDueDate,
            createdAt: this.createdAt,
            isCanceled: this.isCanceled,
            canceledAt: this.canceledAt
        }
    }

    public static async getInstanceById(billId: number){
        const billDAO = new BillDAO()
        const [billData, installmentsData] = await Promise.all([
            billDAO.getBillById(billId),
            billDAO.getInstallmentsByBillId(billId)
        ])
        return new this({
            biilId: billData.billId,
            userId: billData.userId,
            billType: billData.typeId,
            description: billData.description,
            value: billData.value,
            installmentsQuantity: billData.installments,
            installments: installmentsData.map(installment => new BillInstallment(installment)),
            paymentDay: billData.paymentDay,
            firstDueDate: billData.firstDueDate,
            createdAt: billData.createdAt,
            isCanceled: billData.isCanceled,
            canceledAt: billData.canceledAt
        })
    }

    private isCreated(){
        return this.biilId !== undefined
    }
}