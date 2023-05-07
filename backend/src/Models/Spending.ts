import SpendingDAO from "../DAO/SpendingDAO";
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";
import getCurrentStringDatetime from "../Utils/DateUtils";
import Transaction, { TransactionType } from "./Transactions";

interface SpendingType extends TransactionType{
    spendingId?: number
    categoryKey: keyof typeof SpendingCategoryEnum
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
            await this.spendingDAO.update({
                spendingId: this.spendingId!,
                userId: this.userId,
                description: this.description,
                category: this.categoryKey,
                value: this.value,
                spentAt: this.spentAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt
            })
        }else{
            this.spendingId = await this.spendingDAO.insertAndReturnId({
                userId: this.userId,
                description: this.description,
                category: this.categoryKey,
                value: this.value,
                spentAt: this.spentAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt
            })
        }
    }

    public reclaimRewards(){
        
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

    public static async getInstanceById(spendingId: number){
        const spendingDAO = new SpendingDAO()
        const spendingData = await spendingDAO.findById(spendingId)
        return new this({
            spendingId: spendingData.spendingId,
            userId: spendingData.userId,
            description: spendingData.description,
            categoryKey: spendingData.category,
            value: spendingData.value,
            spentAt: spendingData.spentAt,
            isCanceled: spendingData.isCanceled,
            canceledAt: spendingData.canceledAt
        })
    }

    private isCreated(){
        return this.spendingId !== undefined
    }
}