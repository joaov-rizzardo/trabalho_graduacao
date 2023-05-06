import SpendingDAO from "../DAO/SpendingDAO";
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";
import getCurrentStringDatetime from "../Utils/DateUtils";
import Transaction, { TransactionType } from "./Transactions";

interface SpendingType extends TransactionType{
    spendingId?: number
    categoryKey: keyof typeof SpendingCategoryEnum
    categoryDescription: SpendingCategoryEnum
    spentAt?: string
}
export default class Spending extends Transaction {
    private spendingId?: number
    private categoryKey: keyof typeof SpendingCategoryEnum
    private categoryDescription: SpendingCategoryEnum
    private spentAt?: string
    private spendingDAO: SpendingDAO

    constructor(params: SpendingType){
        super({
            userId: params.userId,
            description: params.description,
            value: params.value,
            isCanceled: params.isCanceled,
            canceledAt: params.canceledAt
        })
        this.spendingId = params.spendingId
        this.categoryKey = params.categoryKey
        this.categoryDescription = SpendingCategoryEnum[params.categoryKey]
        this.spentAt = params.spentAt
        this.spendingDAO = new SpendingDAO()
    }

    public async save(){
        if(this.isCreated()){

        }else{
            
        }
    }

    public convertToObject(){
        return {
            spendingId: this.spendingId,
            categoryKey: this.categoryKey,
            categoryDescription: this.categoryDescription,
            spentAt: this.spentAt, 
            userId: this.userId,
            description: this.description,
            value: this.value,
            isCanceled: this.isCanceled,
            canceledAt: this.canceledAt
        }
    }

    public cancelSpending(){
        this.isCanceled = true
        this.canceledAt = getCurrentStringDatetime()
    }

    private isCreated(){
        return this.spendingId !== undefined
    }
}