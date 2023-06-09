import {Request, Response} from 'express'
import { default500Response } from '../Utils/DefaultResponses'
import User from '../Models/User'
import { AuthenticationLogger, generateErrorLogFromRequest } from '../Utils/Logger'

export default async function checkPasswordFlow(req: Request, res: Response){
    try {
        const userId = req.authenticatedUser!.userId
        const password: string = req.body.password
        const checkedPassword = await checkPasswordByUserId(userId, password)
        return res.status(200).send({checked: checkedPassword})
    }catch(error: any){
        generateErrorLogFromRequest(AuthenticationLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function checkPasswordByUserId(userId: number, password: string){
    const user = await User.getInstanceByUserId(userId)
    return await user.checkPassword(password)
} 