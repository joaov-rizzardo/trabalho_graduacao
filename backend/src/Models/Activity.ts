import ActivityDAO from "../DAO/ActivityDAO"

type ActivityFieldsType = {
    activityId?: number
    userId: number
    description: string
    createdAt: string
}

export default class Activity {
    private activityId?: number
    private userId: number
    private description: string
    private createdAt: string
    private activityDAO: ActivityDAO

    constructor(params: ActivityFieldsType){
        this.activityId = params.activityId
        this.userId = params.userId
        this.description = params.description
        this.createdAt = params.createdAt
        this.activityDAO = new ActivityDAO()
    }

    public async save(){
        if(this.isCreated()){
            await this.activityDAO.update({
                activityId: this.activityId!,
                userId: this.userId,
                description: this.description,
                createdAt: this.createdAt
            })
        }else{
            this.activityId = await this.activityDAO.insertAndReturnId({
                userId: this.userId,
                description: this.description,
                createdAt: this.createdAt
            })
        }
    }

    public convertToObject(){
        return {
            activityId: this.activityId,
            userId: this.userId,
            description: this.description,
            createdAt: this.createdAt
        }
    }

    private isCreated(){
        return this.activityId !== undefined
    }
}