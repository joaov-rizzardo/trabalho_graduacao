import { Readable } from 'node:stream';
import fs from 'fs'
import path from 'path'
import axios from 'axios';

export const avatarsDirectory = `${path.dirname(__filename)}/../../Assets/Avatars`

export function getCurrentAvatarsOnDirectory(){
    const allDirectoryFiles = fs.readdirSync(avatarsDirectory);
    const avatarsFiles = allDirectoryFiles.filter(file => path.extname(file) === ".png")
    const avatarsNames = avatarsFiles.map(avatar => avatar.replace(/\.png/g, ""))
    return avatarsNames
}

export async function getAvatarImageStreamFromAPI(avatarName: string){
    const API_URL = process.env.AVATAR_API_URL
    const response = await axios.get<Readable>(`${API_URL}/${avatarName}.png`, {
        responseType: 'stream'
    })
    const stream = response.data
    return stream
}

export function uploadImageStreamToAvatarsDirectory(imageStream: Readable, avatarName: string){
    imageStream.pipe(fs.createWriteStream(`${avatarsDirectory}/${avatarName}.png`))
}

export function generateRandomAvatarName(){
    let randomString = ""
    const maxLength = 10
    const allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const charactersQuantity = allowedCharacters.length
    const randomLength = Math.floor((Math.random() * maxLength) + 1)
    for(let i = 0; i < randomLength; i++){
        randomString += allowedCharacters.charAt(Math.floor(Math.random() * charactersQuantity))
    }
    return randomString
}

export function generateNotExistentAvatarName(existentAvatars: string[]){
    let avatarName = ''
    while(existentAvatars.includes(avatarName) || avatarName === ''){
        avatarName = generateRandomAvatarName()
    }
    return avatarName
}