import AvatarDAO from "../DAO/AvatarDAO"
import getCurrentStringDatetime from "../Utils/DateUtils"

export type AvatarType = {
    avatarId?: number
    name: string
    createdAt?: string
}

export default class Avatar {
    private avatarId?: number
    private name: string
    private createdAt: string
    private avatarDAO: AvatarDAO

    constructor({avatarId, name, createdAt}: AvatarType){
        this.avatarId = avatarId
        this.name = name
        this.avatarDAO = new AvatarDAO()
        if(createdAt !== undefined){
            this.createdAt = createdAt
        }else{
            this.createdAt = getCurrentStringDatetime()
        }
    }

    public getAvatarId(){
        return this.avatarId
    }

    public convertToObject(){
        return {
            avatarId: this.avatarId,
            name: this.name,
            createdAt: this.createdAt
        }
    }

    public async reclaimToUser(userId: number){
        if(this.isCreated()){
            await this.avatarDAO.insertToUser({
                userId: userId,
                avatarId: this.avatarId!
            })
        }
    }

    public async save(){
        if(this.isCreated()){
            await this.avatarDAO.update({
                avatarId: this.avatarId!,
                name: this.name
            })
        }else{
            this.avatarId = await this.avatarDAO.insertAndReturnId({
                name: this.name,
                createdAt: this.createdAt
            })
        }
    }

    public static async getInstanceByAvatarId(avatarId: number){
        const avatarDao = new AvatarDAO()
        const recoveredAvatar = await avatarDao.getAvatarById(avatarId)
        return new this(recoveredAvatar)
    }

    public isCreated(): boolean{
        return this.avatarId !== undefined
    }

}