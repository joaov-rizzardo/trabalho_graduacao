import {Request, Response} from 'express'
import { ErrorLogger } from '../Utils/Logger'
import { default500Response } from '../Utils/DefaultResponses'
import UserEmailCodes from '../Models/UserEmailCodes'
import User from '../Models/User'

export async function sendEmailVerificationCodeToUser(req: Request, res: Response){
    const userId = parseInt(req.params.userId)
    try {
        const userEmailCodes = await UserEmailCodes.getInstanceByUserId(userId)
        await userEmailCodes.sendRandomUserCode()
        return res.status(200).send({
            message: 'The verification code has been sent'
        })
    }catch(error: any){
        ErrorLogger.error(error.message)
        return res.status(500).send(default500Response())
    }
}

export async function checkEmailVerificationCode(req: Request, res: Response){
    const userId: number = req.body.userId
    const code: string = req.body.code
    try{
        const userEmailCodes = await UserEmailCodes.getInstanceByUserId(userId)
        if(await userEmailCodes.checkLastCodeSent(code) === true){
            const user = await User.getInstanceByUserId(userId)
            user.validateEmail()
            await user.save()
            return res.status(200).send({
                checked: true
            })
        }else{
            return res.status(200).send({
                checked: false
            })
        }
    }catch(error: any){
        ErrorLogger.error(error.message)
        return res.status(500).send(default500Response()) 
    }
}

