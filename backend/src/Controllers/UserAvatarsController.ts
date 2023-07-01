import {Request, Response} from 'express'
import { default500Response } from '../Utils/DefaultResponses'
import UserAvatars from '../Models/UserAvatars'

export async function getUserAvatarsFlow(req: Request, res: Response){
    try {
        const userId = req.authenticatedUser!.userId
        const avatars = await getUserAvatarsByUserId(userId)
        return res.status(200).send(avatars)
    }catch(error: any){
        return res.status(500).send(default500Response())
    }
}

export async function getUserAvatarsByUserId(userId: number){
    const userAvatars = await UserAvatars.getInstanceByUserId(userId)
    return userAvatars.convertToAvatarList()
}