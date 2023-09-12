import ActivityDAO from "../DAO/ActivityDAO"
import Activity from "./Activity"

type UserActivitysType = {
    userId: number
    activitys: Activity[]
}
export default class UserActivitys {
    private userId: number
    private activitys: Activity[]

    constructor({userId, activitys}: UserActivitysType){
        this.userId = userId
        this.activitys = activitys
    }

    public convertToObject(){
        return {
            userId: this.userId,
            activitys: this.activitys.map(activity => activity.convertToObject())
        }
    }

    public static async getInstanceWithLastThirdyActivitys(userId: number){
        const activityDAO = new ActivityDAO()
        const recoveredActivitys = await activityDAO.findLastThirdyActivitys(userId)
        return new this({
            userId: userId,
            activitys: recoveredActivitys.map(activity => new Activity(activity))
        })
    }

    public static async getInstanceWithAllActivitys(userId: number){
        const activityDAO = new ActivityDAO()
        const recoveredActivitys = await activityDAO.findAllActivitys(userId)
        return new this({
            userId: userId,
            activitys: recoveredActivitys.map(activity => new Activity(activity))
        }) 
    }
}