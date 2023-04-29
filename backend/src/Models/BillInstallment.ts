import BillDAO from "../DAO/BillDAO"
import getCurrentStringDatetime from "../Utils/DateUtils"
import { ErrorLogger } from "../Utils/Logger"

type BillInstallmentType = {
    installmentId?: number
    billId: number
    installmentNumber: number
    value: number
    dueDate: string
    isPayed: boolean
    payedAt?: string
    createdAt: string   
}
export default class BillInstallment {
    private installmentId?: number
    private billId: number
    private installmentNumber: number
    private value: number
    private dueDate: string
    private isPayed: boolean
    private payedAt?: string
    private createdAt: string
    private isExpired: boolean
    private billDAO: BillDAO

    constructor(params: BillInstallmentType){
        this.installmentId = params.installmentId
        this.billId = params.billId
        this.installmentNumber = params.installmentNumber
        this.value = params.value
        this.dueDate = params.dueDate
        this.isPayed = params.isPayed
        this.payedAt = params.payedAt
        this.createdAt = params.createdAt
        this.isExpired = false
        this.billDAO = new BillDAO()

        this.checkIfIsExpired()
    }

    public async save(){

    }

    public pay(){
        this.isPayed = true
        this.payedAt = getCurrentStringDatetime()
    }

    private checkIfIsExpired(){
        try {
            const expireDate = new Date(this.dueDate)
            const currentDate = new Date()
            if(currentDate > expireDate){
                this.isExpired = true
            }else {
                this.isExpired = false
            }
        }catch(error: any){
            ErrorLogger.error(error.stack)
        } 
    }

    private isCreated(){
        return this.installmentId !== undefined
    }
}