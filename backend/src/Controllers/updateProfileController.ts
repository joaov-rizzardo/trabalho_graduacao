import {Request, Response} from 'express'
import { default400Response, default500Response } from '../Utils/DefaultResponses'
import User from '../Models/User'
import UserAvatars from '../Models/UserAvatars'

export default async function updateProfileFlow(req: Request, res: Response){
    try{
        const {name, lastName, selectedAvatar} = req.body
        const userId = parseInt(req.params.userId)
        if(await checkIfUserHasAvatar(userId, selectedAvatar) === false){
            return res.status(400).send(default400Response(['User does not have selected avatar']))
        }
        await updateProfile({
            userId,
            name,
            lastName,
            selectedAvatar
        })
        return res.status(200).send({
            message: 'The profile has been updated'
        })
    }catch(error: any){
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