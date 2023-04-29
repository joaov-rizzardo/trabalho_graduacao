import GoalDAO from "../DAO/GoalDAO"
import Goal from "./Goal"

type UserGoalsType = {
    userId: number
    goals: Goal[]
}
export default class UserGoals {
    private userId: number
    private goals: Goal[]

    constructor({userId, goals}: UserGoalsType){
        this.userId = userId
        this.goals = goals
    }

    public addGoalToUser(goal: Goal){
        this.goals.push(goal)
    }

    public convertToObject(){
        return {
            userId: this.userId,
            goals: this.goals.map(goal => goal.convertToObject())
        }
    }
    
    public static async instanceWithAllUserGoals(userId: number){
        const goalDAO = new GoalDAO()
        const goals = await goalDAO.findAllUserGoals(userId)
        return new this({
            userId: userId,
            goals: goals.map(goal => new Goal(goal))
        })
    }
}