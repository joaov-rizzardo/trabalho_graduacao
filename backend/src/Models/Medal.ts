import MedalDAO from "../DAO/MedalDAO"

type MedalType = {
    medalId?: number
    name: string
    filename: string
    createdAt?: string
}

export default class Medal {
    private medalId?: number
    private name: string
    private filename: string
    private createdAt?: string
    private medalDAO: MedalDAO

    constructor(params: MedalType){
        this.medalId = params.medalId
        this.name = params.name
        this.filename = params.filename
        this.createdAt = params.createdAt
        this.medalDAO = new MedalDAO()
    }

    public async save(){
        if(this.isCreated()){
            await this.medalDAO.update({
                medalId: this.medalId!,
                name: this.name,
                filename: this.filename,
                createdAt: this.createdAt
            })
        }else{
            this.medalId = await this.medalDAO.insertAndReturnId({
                name: this.name,
                filename: this.filename,
                createdAt: this.createdAt
            })
        }
    }

    public convertToObject(){
        return {
            medalId: this.medalId,
            name: this.name,
            filename: this.filename,
            createdAt: this.createdAt
        }
    }

    public async reclaimToUser(userId: number){
        if(this.isCreated()){
            await this.medalDAO.insertMedalToUser(userId, this.medalId!)
        }
    }

    public static async getInstanceById(medalId: number){
        const medalDAO = new MedalDAO()
        const medalData = await medalDAO.findMedalById(medalId)
        return new this(medalData)
    }

    private isCreated(){
        return this.medalId !== undefined
    }

    get getId(){
        return this.medalId
    }
}