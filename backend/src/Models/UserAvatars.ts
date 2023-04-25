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
        }
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