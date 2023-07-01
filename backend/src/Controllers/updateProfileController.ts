import {Request, Response} from 'express'
import { default400Response, default500Response } from '../Utils/DefaultResponses'
import User from '../Models/User'
import UserAvatars from '../Models/UserAvatars'
import { commitTransaction, rollbackTransaction, startTransaction } from '../Services/Database'

export default async function updateProfileFlow(req: Request, res: Response){
    try{
        await startTransaction()
        const {name, lastName, selectedAvatar} = req.body
        const userId = req.authenticatedUser!.userId
        if(await checkIfUserHasAvatar(userId, selectedAvatar) === false){
            await rollbackTransaction()
            return res.status(400).send(default400Response(['User does not have selected avatar']))
        }
        await updateProfile({
            userId,
            name,
            lastName,
            selectedAvatar
        })
        await commitTransaction()
        return res.status(200).send({
            message: 'The profile has been updated'
        })
    }catch(error: any){
        await rollbackTransaction()
        res.status(500).send(default500Response())
    }
}

type updateProfileType = {
    userId: number,
    name: string, 
    lastName: string, 
    selectedAvatar: number
}

export async function updateProfile({userId, name, lastName, selectedAvatar}: updateProfileType){
    const user = await User.getInstanceByUserId(userId)
    await user.updateProfile({
        name,
        lastName,
        selectedAvatar
    })
}

export async function checkIfUserHasAvatar(userId: number, avatarId: number){
    const userAvatar = await UserAvatars.getInstanceByUserId(userId)
    return userAvatar.userAlreadyOwned(avatarId)
}