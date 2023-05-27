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
    private allAvatarsIds: null | number[] = null

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
            throw new Error('O avatar ainda não foi criado')
        }
        if(!this.userAlreadyOwned(avatar.getAvatarId()!)){
            await avatar.reclaimToUser(this.userId)
            this.avatars.push(avatar)
            this.avatarIds.push(avatar.getAvatarId()!)
        }
    }

    public async addRandomAvatarToUser(){
        const randomAvatarId = await this.getRandomNotReclaimedAvatarId()
        const avatar = await Avatar.getInstanceByAvatarId(randomAvatarId)
        await this.addAvatarToUser(avatar)
    }

    public static async getInstanceByUserId(userId: number){
        const avatarDAO = new AvatarDAO()
        const userAvatars = await avatarDAO.getUserAvatars(userId)
        return new this ({
            userId: userId,
            avatars: userAvatars.map(avatar => new Avatar(avatar))
        })
    }

    public userAlreadyOwned(avatarId: number){
        return this.avatarIds.includes(avatarId)
    }

    private async getRandomNotReclaimedAvatarId(){
        if(this.allAvatarsIds === null){
            await this.setAllAvatarsIds()
        }
        if(this.allAvatarsIds!.length === this.avatarIds.length){
            throw new Error(`O usuário ${this.userId} já possuí todos os avatares disponíveis`)
        }
        const notReclaimedAvatarsId = this.allAvatarsIds!.filter(avatarId => !this.avatarIds.includes(avatarId))
        const maxAvatarIndex = notReclaimedAvatarsId.length - 1
        const randomAvatarIndex = Math.floor(Math.random() * maxAvatarIndex)
        return notReclaimedAvatarsId[randomAvatarIndex]
    }

    private async setAllAvatarsIds(){
        this.allAvatarsIds = await Avatar.getAllAvatarsIds()
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