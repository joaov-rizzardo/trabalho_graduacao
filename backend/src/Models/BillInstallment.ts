import BillDAO from "../DAO/BillDAO"
import getCurrentStringDatetime from "../Utils/DateUtils"

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

    get isPaid(){
        return this.isPayed
    }

    public async save(){
        if(this.isCreated()){
            await this.billDAO.updateInstallment({
                installmentId: this.installmentId!,
                billId: this.billId,
                installmentNumber: this.installmentNumber,
                value: this.value,
                dueDate: this.dueDate,
                isPayed: this.isPayed,
                payedAt: this.payedAt,
                createdAt: this.createdAt,
            })
        }else{
            this.installmentId = await this.billDAO.insertInstallmentAndReturnId({
                billId: this.billId,
                installmentNumber: this.installmentNumber,
                value: this.value,
                dueDate: this.dueDate,
                isPayed: this.isPayed,
                payedAt: this.payedAt,
                createdAt: this.createdAt
            })
        }
    }

    public convertToObject(){
        return {
            installmentId: this.installmentId,
            billId: this.billId,
            installmentNumber: this.installmentNumber,
            value: this.value,
            dueDate: this.dueDate,
            isPayed: this.isPayed,
            payedAt: this.payedAt,
            createdAt: this.createdAt,
            isExpired: this.isExpired
        }
    }

    public pay(){
        this.isPayed = true
        this.payedAt = getCurrentStringDatetime()
    }

    public static async getInstanceById(installmentId: number){
        const billDAO = new BillDAO()
        const installmentData = await billDAO.getInstallmentById(installmentId)
        return new this(installmentData)
    }

    private checkIfIsExpired(){
        const expireDate = new Date(this.dueDate)
        const currentDate = new Date()
        if(currentDate > expireDate){
            this.isExpired = true
        }else {
            this.isExpired = false
        }
    }

    private isCreated(){
        return this.installmentId !== undefined
    }
}