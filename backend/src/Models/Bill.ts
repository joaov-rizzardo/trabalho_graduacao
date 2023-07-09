
import BillDAO from "../DAO/BillDAO"
import { BillEnum } from "../Enums/BillEnum"
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum"
import getCurrentStringDatetime, { dateDiferenceInDays } from "../Utils/DateUtils"
import BillInstallment from "./BillInstallment"

type BillType = {
    biilId?: number
    userId: number
    billType: keyof typeof BillEnum
    category: keyof typeof SpendingCategoryEnum,
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
    private categoryKey: keyof typeof SpendingCategoryEnum
    private categoryDescription: SpendingCategoryEnum
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
        this.categoryKey = params.category
        this.categoryDescription = SpendingCategoryEnum[params.category]
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
                category: this.categoryKey,
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
                category: this.categoryKey,
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

    public cancel(){
        const wasCreatedMoreThan1DayAgo = dateDiferenceInDays(new Date(this.createdAt), new Date()) >= 1
        const alreadyPaidSomeInstallment = this.hasPaidInstallment()
        if(wasCreatedMoreThan1DayAgo && alreadyPaidSomeInstallment){
            throw new Error('A conta não pode ser cancelada, o prazo para cancelamento expirou')
        }
        this.isCanceled = true
        this.canceledAt = getCurrentStringDatetime()
    }

    public convertToObject(){
        return {
            biilId: this.biilId,
            userId: this.userId,
            billType: this.billType,
            billTypeDescription: this.billTypeDescription,
            categoryKey: this.categoryKey,
            categoryDescription: this.categoryDescription,
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

    public get getDescription(){
        return this.description
    }

    public get getBillType(){
        return this.billType
    }

    public get getInstallments(){
        return this.installments
    }

    public isActive(){
        if(this.isCanceled === true){
            return false
        }
        if(this.billType === 'F'){
            return true
        }
        const isFullyPaid = this.installments?.reduce((status, currentValue) => {
            if(currentValue.isPaid === false){
                status = false
            }
            return status
        }, true)
        if(isFullyPaid === false){
            return true
        }else{
            return false
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
            category: billData.category,
            description: billData.description,
            installmentValue: billData.installmentValue,
            installments: installmentsData.map(installment => new BillInstallment(installment)),
            paymentDay: billData.paymentDay,
            createdAt: billData.createdAt,
            isCanceled: billData.isCanceled,
            canceledAt: billData.canceledAt
        })
    }

    private hasPaidInstallment(){
        let hasPaid = false
        this.installments?.forEach(installment => {
            if(installment.isPaid){
                hasPaid = true
            }
        })
        return hasPaid
    }

    private isCreated(){
        return this.biilId !== undefined
    }
}