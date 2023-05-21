import { ErrorLogger } from './../../Utils/Logger';
import { Args } from "../Utils/ArgsParser";
import { generateNotExistentAvatarName, getAvatarImageStreamFromAPI, getCurrentAvatarsOnDirectory, uploadImageStreamToAvatarsDirectory } from "../Utils/AvatarUtils";
import Avatar from '../../Models/Avatar';
import getCurrentStringDatetime from '../../Utils/DateUtils';

export default async function handleSearchForNewAvatars(args: Args){
    if(!args.avatarsQuantity){
        console.log('A quantidade de avatares não foi definida')
        process.exit()
    }
    const existentsAvatars = getCurrentAvatarsOnDirectory()
    let i = 0;
    const interval = setInterval(async () => {
        try {
            if(i > parseInt(args.avatarsQuantity)){
                clearInterval(interval)
            }
            const randomName = generateNotExistentAvatarName(existentsAvatars)
            await findAndSaveByAvatarName(randomName)
            existentsAvatars.push(randomName)
            i++
        }catch(error: any){
            ErrorLogger.error(error.message)
        }
    }, 72000)
}

async function findAndSaveByAvatarName(avatarName: string){
    const imageStream = await getAvatarImageStreamFromAPI(avatarName)
    uploadImageStreamToAvatarsDirectory(imageStream, avatarName)
    await saveAvatarOnDatabase(avatarName)
    console.log(`Avatar ${avatarName} adicionado na base de dados`)
}

async function saveAvatarOnDatabase(avatarName: string){
    const avatar = new Avatar({
        name: avatarName,
        createdAt: getCurrentStringDatetime()
    })
    await avatar.save()
}


