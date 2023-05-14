import AvatarDAO from "../DAO/AvatarDAO"
import Avatar from "./Avatar"

export type UserAvatarsType = {
    userId: number
    avatars: Avatar[]
}

export default class UserAvatars {
    private userId: number
    private avatarIds: number[]
    private avatars: Avatar[]

    constructor({userId, avatars}: UserAvatarsType){
        this.userId = userId
        this.avatars = avatars
        this.avatarIds = []
        this.setAvatarIdsByObjectList()
    }

    public convertToAvatarList(){
        return this.avatars.map(avatar => avatar.convertToObject())
    }

    public async addAvatarToUser(avatar: Avatar){
        if(!avatar.isCreated()){
            throw new Error('O usuário ainda não foi criado')
        }
        if(!this.userAlreadyOwned(avatar.getAvatarId()!)){
            await avatar.reclaimToUser(this.userId)
            this.avatars.push(avatar)
            this.avatarIds.push(avatar.getAvatarId()!)
        }
    }

    public static async getInstanceByUserId(userId: number){
        const avatarDAO = new AvatarDAO()
        const userAvatars = await avatarDAO.getUserAvatars(userId)
        return new this ({
            userId: userId,
            avatars: userAvatars.map(avatar => new Avatar(avatar))
        })
    }

    private userAlreadyOwned(avatarId: number){
        return this.avatarIds.includes(avatarId)
    }

    private setAvatarIdsByObjectList(){
        this.avatars.forEach(avatar => {
            const id = avatar.getAvatarId()
            if(id !== undefined){
                this.avatarIds.push(id)
            }
        })
    }
}