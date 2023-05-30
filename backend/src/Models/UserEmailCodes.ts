import UserDAO from "../DAO/UserDAO"

export default class UserEmailCodes {
    private userId: number
    private email: string

    constructor({userId, email}: {userId: number, email: string}){
        this.userId = userId
        this.email = email
    }

    public async sendRandomUserCode(){
        
    }

    private generateRandomCode(){
        const minCodeValue = 0
        const maxCodeValue = 99999
        const randomNumber = Math.floor(Math.random() * (maxCodeValue - minCodeValue)) + minCodeValue
        const paddedNumber = randomNumber.toString().padStart(5, "0")
        return paddedNumber
    }

    public static async getInstanceByUserId(userId: number){
        const userDAO = new UserDAO()
        const user = await userDAO.getUserById(userId)
        if(user === false){
            throw new Error(`Não foi possível recuperar o usuário pelo ID: ${userId}`)
        }
        return new this({
            userId: user.userId,
            email: user.email
        })
    }
}