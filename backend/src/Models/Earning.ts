import EarningDAO from "../DAO/EarningDAO";
import { EarningCategoryEnum } from "../Enums/EarningCategoryEnum";
import getCurrentStringDatetime from "../Utils/DateUtils";
import Transaction, { TransactionType } from "./Transactions";

interface EarningType extends TransactionType{
    earningId: number
    categoryKey: keyof typeof EarningCategoryEnum
    earnedAt?: string
}

export default class Earning extends Transaction {
    private earningId?: number
    private categoryKey: keyof typeof EarningCategoryEnum
    private categoryDescription: EarningCategoryEnum
    private earnedAt?: string
    private earningDAO: EarningDAO

    constructor(params: EarningType){
        super({
            userId: params.userId,
            description: params.description,
            value: params.value,
            isCanceled: params.isCanceled,
            canceledAt: params.canceledAt
        })
        this.earningId = params.earningId
        this.categoryKey = params.categoryKey
        this.categoryDescription = EarningCategoryEnum[params.categoryKey]
        this.canceledAt = params.canceledAt
        this.earningDAO = new EarningDAO()
    }
    
    public reclaimRewards(){

    }

    public async save(){
        if(this.isCreated()){
            this.earningId = await this.earningDAO.insertAndReturnId({
                userId: this.userId,
                description: this.description,
                category: this.categoryKey,
                value: this.value,
                earnedAt: this.earnedAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt
            })
        }else{
            await this.earningDAO.update({
                earningId: this.earningId!,
                userId: this.userId,
                description: this.description,
                category: this.categoryKey,
                value: this.value,
                earnedAt: this.earnedAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt,
            })
        }
    }

    public convertToObject(){
        return {
            earningId: this.earningId,
            categoryKey: this.categoryKey,
            categoryDescription: this.categoryDescription,
            earnedAt: this.earnedAt,
            userId: this.userId,
            description: this.description,
            value: this.value,
            isCanceled: this.isCanceled,
            canceledAt: this.canceledAt
        }
    }

    public cancelEarning(){
        this.isCanceled = true
        this.canceledAt = getCurrentStringDatetime()
    }

    public static async getInstanceById(earningId: number){
        const earningDAO = new EarningDAO()
        const earningData = await earningDAO.findById(earningId)
        return new this ({
            earningId: earningData.earningId,
            categoryKey: earningData.category,
            earnedAt: earningData.earnedAt,
            userId: earningData.userId,
            description: earningData.description,
            value: earningData.value,
            isCanceled: earningData.isCanceled,
            canceledAt: earningData.canceledAt
        })
    }

    private isCreated(){
        return this.earningId !== undefined
    }
}