import AchievementDAO from "../DAO/AchievementDAO"
import Achievement from "./Achievement"
import Medal from "./Medal"

type UserAchievementsType = {
    userId: number,
    achievements: Achievement[]
}

export default class UserAchievements {
    private userId: number
    private achievements: Achievement[]

    constructor({userId, achievements}: UserAchievementsType){
        this.userId = userId
        this.achievements = achievements
    }

    public convertToObject(){
        return {
            userId: this.userId,
            achievements: this.achievements.map(achievement => achievement.convertToObject())
        }
    }

    public static async getInstanceByUserId(userId: number){
        const achievementDAO = new AchievementDAO()
        const achievementData = await achievementDAO.findByUserId(userId)
        return new this({
            userId: userId,
            achievements: await Promise.all(achievementData.map(async achievement => new Achievement({
                achievementId: achievement.achievementId,
                typeKey: achievement.typeId,
                name: achievement.name,
                description: achievement.description,
                xpReward: achievement.xpReward,
                pointReward: achievement.pointReward,
                medalReward: achievement.medalReward !== undefined ? await Medal.getInstanceById(achievement.medalReward) : achievement.medalReward,
                goal: achievement.goal,
                createdAt: achievement.createdAt
            })))
        })

    }
}