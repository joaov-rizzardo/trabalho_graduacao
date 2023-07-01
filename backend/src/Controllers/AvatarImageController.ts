import {Request, Response} from 'express'
import { default500Response } from '../Utils/DefaultResponses'
import Avatar from '../Models/Avatar'
import path from 'path'
import { ProfileLogger, generateErrorLogFromRequest } from '../Utils/Logger'

export async function sendAvatarImage(req: Request, res: Response){
    try {
        const avatarId = parseInt(req.params.avatarId)
        const avatarPath = await getAvatarImagePathByAvatarId(avatarId)
        return res.status(200).sendFile(path.resolve(avatarPath))
    }catch(error: any){
        generateErrorLogFromRequest(ProfileLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function getAvatarImagePathByAvatarId(avatarId: number){
    const avatar = await Avatar.getInstanceByAvatarId(avatarId)
    const avatarName = avatar.getAvatarName
    const path = __dirname + `/../Assets/Avatars/${avatarName}.png`
    return path
}