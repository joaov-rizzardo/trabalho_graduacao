import AchievementDAO from "../DAO/AchievementDAO"
import { AchievementTypeEnum } from "../Enums/AchievementTypeEnum"
import Medal from "./Medal"

type AchievementType = {
    achievementId?: number
    typeKey: keyof typeof AchievementTypeEnum
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
        this.typeDescription = AchievementTypeEnum[params.typeKey]
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
            await this.achievementDAO.update({
                achievementId: this.achievementId!,
                typeId: this.typeKey,
                name: this.name,
                description: this.description,
                xpReward: this.xpReward,
                pointReward: this.pointReward,
                medalReward: this.medalReward?.getId,
                goal: this.goal,
                createdAt: this.createdAt
            })
        }else {
            this.achievementId = await this.achievementDAO.insertAndReturnId({
                typeId: this.typeKey,
                name: this.name,
                description: this.description,
                xpReward: this.xpReward,
                pointReward: this.pointReward,
                medalReward: this.medalReward?.getId,
                goal: this.goal,
                createdAt: this.createdAt
            })
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

    public static async getInstanceById(achievementId: number){
        const achievementDAO = new AchievementDAO()
        const achievementData = await achievementDAO.findById(achievementId)
        return new this({
            achievementId: achievementData.achievementId,
            typeKey: achievementData.typeId,
            name: achievementData.name,
            description: achievementData.description,
            xpReward: achievementData.xpReward,
            pointReward: achievementData.pointReward,
            medalReward: achievementData.medalReward !== undefined ? await Medal.getInstanceById(achievementData.medalReward) : achievementData.medalReward,
            goal: achievementData.goal,
            createdAt: achievementData.createdAt
        })
    }

    private isCreated(){
        return this.achievementId !== undefined
    }
}