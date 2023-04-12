import UserLevelDAO from "../DAO/UserLevelDAO"

export type UserLevelFieldsType = {
    userId: number
    currentLevel: number
    currentXp: number
    points: number
}

export default class UserLevel {
    private userId: number
    private currentLevel: number = 0
    private currentXp: number = 0
    private points: number = 0
    private xpToNextLevel: number = 0
    private UserLevelDAO: UserLevelDAO

    constructor({userId, currentLevel, currentXp, points}: UserLevelFieldsType){
        this.userId = userId
        this.currentLevel = currentLevel
        this.currentXp = currentXp
        this.points = points
        this.UserLevelDAO = new UserLevelDAO()
        this.calculateNeededXp()
    }

    public async save(){
        await this.UserLevelDAO.replace({
            userId: this.userId,
            currentLevel: this.currentLevel,
            currentXp: this.currentXp,
            points: this.points
        })
    }

    public incrementPoints(points: number){
        this.points += points
    }

    public convertToObject() {
        return {
            userId: this.userId,
            currentLevel: this.currentLevel,
            currentXp: this.currentXp,
            points: this.points,
            xpToNextLevel: this.xpToNextLevel
        }
    }

    public incrementXp(addedXp: number){
        this.currentXp += addedXp
        this.levelUp()
    }

    private levelUp(){
        if(this.leveledUp()){
            this.currentLevel++
            this.resetCurrentXp()
            this.calculateNeededXp()
            this.levelUp()
        }
    }

    private leveledUp(): boolean {
        return this.currentXp >= this.xpToNextLevel
    }

    private resetCurrentXp(){
        this.decrementXp(this.xpToNextLevel)
    }
    
    private decrementXp(xp: number){
        this.currentXp -= xp
    }

    private calculateNeededXp(){
        //  Fórmula de cálculo -> 0.1x²+25x+200
        this.xpToNextLevel =  (this.currentLevel * this.currentLevel) + 25*this.currentLevel + 200
    }

    static async getInstanceByUserId(userId: number){
        const userLevelDAO = new UserLevelDAO()
        const recoveredLevel = await userLevelDAO.getLevelByUserId(userId)
        return new this({
            userId: recoveredLevel.userId,
            currentLevel: recoveredLevel.currentLevel,
            currentXp: recoveredLevel.currentXp,
            points: recoveredLevel.points
        })
    }
}