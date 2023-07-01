import {Request, Response} from 'express'
import { default400Response, default500Response } from '../Utils/DefaultResponses'
import UserEmailCodes from '../Models/UserEmailCodes'
import User from '../Models/User'
import { commitTransaction, rollbackTransaction, startTransaction } from '../Services/Database'
import { ProfileLogger, generateErrorLogFromRequest } from '../Utils/Logger'

export default async function updatePasswordFlow(req: Request, res: Response){
    try{
        await startTransaction()
        const {newPassword, validationCode}: {newPassword: string, validationCode: string} = req.body
        const userId = req.authenticatedUser!.userId
        if(await checkValidationCode(userId, validationCode) === false){
            await rollbackTransaction()
            return res.status(400).send(default400Response(['The validation code is invalid']))
        }
        await updatePassword(userId, newPassword)
        await commitTransaction()
        return res.status(200).send({
            message: 'The user password has been updated'
        })
    }catch(error: any){
        await rollbackTransaction()
        generateErrorLogFromRequest(ProfileLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function updatePassword(userId: number, newPassword: string){
    const user = await User.getInstanceByUserId(userId)
    await user.changePassword(newPassword)
    await user.save()
}

async function checkValidationCode(userId: number, validationCode: string){
    const userEmailCodes = await UserEmailCodes.getInstanceByUserId(userId)
    return await userEmailCodes.checkLastCodeSent(validationCode)
}