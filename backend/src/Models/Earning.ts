import EarningDAO from "../DAO/EarningDAO";
import { EarningCategoryEnum } from "../Enums/EarningCategoryEnum";
import getCurrentStringDatetime, { getCurrentStringDate } from "../Utils/DateUtils";
import Transaction, { TransactionType } from "./Transactions";

interface EarningType extends TransactionType{
    earningId?: number
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
        this.earnedAt = params.earnedAt
        this.earningDAO = new EarningDAO()
    }
    
    public async reclaimRewards(){
        if(!this.enableRewards){
            throw new Error('As recompensas não estão disponíveis para esse ganho')
        }
        if(await this.isFirstEarningOfTheDay()){
            return {
                xp: 200,
                points: 1
            }
        }else{
            return {
                xp: 50,
                points: 0
            } 
        }
    }

    public async save(){
        if(this.isCreated()){
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
        }else{
            this.earningId = await this.earningDAO.insertAndReturnId({
                userId: this.userId,
                description: this.description,
                category: this.categoryKey,
                value: this.value,
                earnedAt: this.earnedAt,
                isCanceled: this.isCanceled,
                canceledAt: this.canceledAt
            })
            this.enableRewards = true
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

    public get getUserId(){
        return this.userId
    }

    public get getValue(){
        return this.value
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
    
    private async isFirstEarningOfTheDay(){
        const earningOnThisDayQuantity = await this.earningDAO.getUserEarningsQuantityByDate(this.userId, getCurrentStringDate())
        return earningOnThisDayQuantity <= 1
    }
}