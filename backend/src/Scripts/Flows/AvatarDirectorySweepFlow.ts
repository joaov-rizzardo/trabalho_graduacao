import AvatarDAO from "../../DAO/AvatarDAO";
import Avatar from "../../Models/Avatar";
import getCurrentStringDatetime from "../../Utils/DateUtils";
import { Args } from "../Utils/ArgsParser";
import { getCurrentAvatarsOnDirectory } from "../Utils/AvatarUtils";

export default async function sweepAvatarDirectory(args: Args){
    const avatarsOnDatabase = (await AvatarDAO.getAllAvatars()).map(avatar => avatar.name)
    const avatarsOnDirectory = getCurrentAvatarsOnDirectory()
    for (const avatarName of avatarsOnDirectory){
        if(!avatarsOnDatabase.includes(avatarName)){
            try {
                await createAvatarOnDatabase(avatarName)
                avatarsOnDatabase.push(avatarName)
            }catch(error: any){
                console.log(error)
            }
        }
    }
}

async function createAvatarOnDatabase(avatarName: string){
    const avatar = new Avatar({
        name: avatarName,
        createdAt: getCurrentStringDatetime()
    })
    await avatar.save()
}