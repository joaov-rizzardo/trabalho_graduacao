
import BillDAO from "../DAO/BillDAO"
import { BillEnum } from "../Enums/BillEnum"
import getCurrentStringDatetime from "../Utils/DateUtils"
import BillInstallment from "./BillInstallment"

type BillType = {
    biilId?: number
    userId: number
    billType: keyof typeof BillEnum
    description: string
    installments?: BillInstallment[]
    installmentValue: number
    paymentDay: number
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
    private installments?: BillInstallment[]
    private installmentValue: number
    private paymentDay: number
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
        this.installments = params.installments !== undefined ? params.installments : []
        this.installmentValue = params.installmentValue
        this.paymentDay = params.paymentDay
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
                installmentValue: this.installmentValue,
                paymentDay: this.paymentDay,
                createdAt: this.createdAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt
            })
        }else{
            this.biilId = await this.billDAO.insertBillAndReturnId({
                userId: this.userId,
                typeId: this.billType,
                description: this.description,
                installmentValue: this.installmentValue,
                paymentDay: this.paymentDay,
                createdAt: this.createdAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt
            })
        }
    }

    public async createInstallment({installmentNumber, dueDate}: {installmentNumber: number, dueDate: string}){
        if(!this.isCreated()){
            throw new Error('A conta ainda não foi salva')
        }
        const installment = new BillInstallment({
            billId: this.biilId!,
            installmentNumber: installmentNumber,
            value: this.installmentValue,
            dueDate: dueDate,
            isPayed: false,
            createdAt: getCurrentStringDatetime()
        })
        await installment.save()
        this.installments?.push(installment)
    }

    public isPayed(){
        let isPayed = true
        this.installments?.forEach(installment => {
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
            installments: this.installments?.map(installment => installment.convertToObject()),
            paymentDay: this.paymentDay,
            createdAt: this.createdAt,
            isCanceled: this.isCanceled,
            canceledAt: this.canceledAt
        }
    }

    public get getUserId(){
        return this.userId
    }

    public get getInstallmentValue(){
        return this.installmentValue
    }

    public get getPaymentDay(){
        return this.paymentDay
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
            installmentValue: billData.installmentValue,
            installments: installmentsData.map(installment => new BillInstallment(installment)),
            paymentDay: billData.paymentDay,
            createdAt: billData.createdAt,
            isCanceled: billData.isCanceled,
            canceledAt: billData.canceledAt
        })
    }

    private isCreated(){
        return this.biilId !== undefined
    }
}