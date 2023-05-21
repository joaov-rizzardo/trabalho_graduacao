import AvatarDAO from "../../DAO/AvatarDAO";
import Avatar from "../../Models/Avatar";
import getCurrentStringDatetime from "../../Utils/DateUtils";
import { Args } from "../Utils/ArgsParser";
import { getCurrentAvatarsOnDirectory } from "../Utils/AvatarUtils";

export default async function sweepAvatarDirectory(args: Args){
    const avatarsOnDatabase = (await AvatarDAO.getAllAvatars()).map(avatar => avatar.name)
    const avatarsOnDirectory = getCurrentAvatarsOnDirectory()
    for await (const avatarName of avatarsOnDirectory){
        if(!avatarsOnDatabase.includes(avatarName)){
            const avatar = new Avatar({
                name: avatarName,
                createdAt: getCurrentStringDatetime()
            })
            await avatar.save()
            avatarsOnDatabase.push(avatarName)
        }
    }
}