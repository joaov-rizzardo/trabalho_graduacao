import AchievementDAO from "../DAO/AchievementDAO"
import { AchievementTypeEnum } from "../Enums/AchievementTypeEnum"
import Medal from "./Medal"

type AchievementType = {
    achievementId?: number
    typeKey: keyof typeof AchievementTypeEnum
    typeDescription: AchievementTypeEnum
    name: string
    description: string
    xpReward: number
    pointReward: number
    medalReward?: Medal
    goal: number
    createdAt?: string
}

export default class Achievement {
    private achievementId?: number
    private typeKey: keyof typeof AchievementTypeEnum
    private typeDescription: AchievementTypeEnum
    private name: string
    private description: string
    private xpReward: number
    private pointReward: number
    private medalReward?: Medal
    private goal: number
    private createdAt?: string
    private achievementDAO: AchievementDAO

    constructor(params: AchievementType){
        this.achievementId = params.achievementId
        this.typeKey = params.typeKey
        this.typeDescription = params.typeDescription
        this.name = params.name
        this.description = params.description
        this.xpReward = params.xpReward
        this.pointReward = params.xpReward
        this.medalReward = params.medalReward
        this.goal = params.goal
        this.createdAt = params.createdAt
        this.achievementDAO = new AchievementDAO()
    }

    public async save(){
        if(this.isCreated()){

        }else {
            
        }
    }

    public async reclaimToUser(){

    }

    public reclaimRewards(){

    }

    public convertToObject(){
        return {
            achievementId: this.achievementId,
            typeKey: this.typeKey,
            typeDescription: this.typeDescription,
            name: this.name,
            description: this.description,
            xpReward: this.xpReward,
            pointReward: this.pointReward,
            medalReward: this.medalReward,
            goal: this.goal,
            createdAt: this.createdAt
        }
    }

    private isCreated(){
        return this.achievementId !== undefined
    }
}