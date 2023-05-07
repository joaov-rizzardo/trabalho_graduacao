import MedalDAO from "../DAO/MedalDAO"
import Medal from "./Medal"

type UserMedalsType = {
    userId: number,
    medals: Medal[]
}

export default class UserMedals {
    private userId: number
    private medals: Medal[]

    constructor({userId, medals}: UserMedalsType){
        this.userId = userId
        this.medals = medals
    }

    public convertToObject(){
        return {
            userId: this.userId,
            medals: this.medals.map(medal => medal.convertToObject())
        }
    }

    public static async getInstanceByUserId(userId: number){
        const medalDAO = new MedalDAO()
        const userMedals = await medalDAO.findMedalsByUserId(userId)
        return new this({
            userId: userId,
            medals: userMedals.map(medal => new Medal(medal))
        })
    }
}