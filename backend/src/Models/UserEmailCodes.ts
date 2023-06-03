import UserDAO from "../DAO/UserDAO"
import getCurrentStringDatetime from "../Utils/DateUtils"
import { ErrorLogger } from "../Utils/Logger"
import MailSender from "./MailSender"

export default class UserEmailCodes {
    private userId: number
    private email: string

    constructor({userId, email}: {userId: number, email: string}){
        this.userId = userId
        this.email = email
    }

    public async sendRandomUserCode(){
        try{
            const userDao = new UserDAO()
            const randomCode = this.generateRandomCode()
            const mailSender = new MailSender(this.email)
            await mailSender.sendEmail({
                subject: 'Código de Verificação',
                contentText: `Segue o código para verificação do email: ${randomCode}`
            })
            await userDao.insertEmailVerificationCodeToUser({
                userId: this.userId,
                code: randomCode,
                sentAt: getCurrentStringDatetime()
            })
        }catch(error: any){
            ErrorLogger.error(error.message)
            throw new Error(error)
        }
    }

    public async checkLastCodeSent(code: string): Promise<boolean> {
        try {
            const userDao = new UserDAO()
            const response = await userDao.getLastSentCode(this.userId)
            if(response === false){
                return false
            }
            const {code: lastCode, sentAt} = response
            if(this.isExpiredCode(sentAt)){
                return false
            }
            if(code === lastCode){
                return true
            }else{
                return false
            }
        }catch(error: any){
            ErrorLogger.error(error.message)
            return false
        }
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

    private isExpiredCode(date: string){
        const codeDate = new Date()
        const currentDate = new Date()
        const timeDiffInMilliseconds = currentDate.getTime() - codeDate.getTime()
        const timeDiffInMinutes = timeDiffInMilliseconds/60000
        const maxTimeToExpireInMinutes = 5
        if(timeDiffInMinutes >= maxTimeToExpireInMinutes){
            return true
        }else{
            return false
        }
    }
}