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

    private setAvatarIdsByObjectList(){
        this.avatars.forEach(avatar => {
            const id = avatar.getAvatarId()
            if(id !== undefined){
                this.avatarIds.push(id)
            }
        })
    }
}