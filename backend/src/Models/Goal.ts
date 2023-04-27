import GoalDAO from "../DAO/GoalDAO"
import getCurrentStringDatetime from "../Utils/DateUtils"

type GoalFieldsType = {
    goalId?: number
    userId: number
    description: string
    value: number
    progressValue: number
    createdAt: string
    isCanceled: boolean
    canceledAt?: string
    isCompleted: boolean
    completedAt?: string
}

export default class Goal {
    private goalId?: number
    private userId: number
    private description: string
    private value: number
    private progressValue: number
    private createdAt: string
    private isCanceled: boolean
    private canceledAt?: string
    private isCompleted: boolean
    private completedAt?: string
    private goalDAO: GoalDAO

    constructor(params: GoalFieldsType){
        this.goalId = params.goalId
        this.userId = params.userId
        this.description = params.description
        this.value = params.value
        this.progressValue = params.progressValue
        this.createdAt = params.createdAt
        this.isCanceled = params.isCanceled
        this.canceledAt = params.canceledAt
        this.isCompleted = params.isCompleted
        this.completedAt = params.completedAt
        this.goalDAO = new GoalDAO()
    }

    public goalIsCompleted(){
        return this.isCompleted
    }

    public goalIsCanceled(){
        return this.isCanceled
    }

    public incrementProgress(quantity: number){
        if(this.goalIsCompleted()){
            throw new Error('A meta já foi completa, não é possível realizar o investimento')
        }
        if(this.goalIsCanceled()){
            throw new Error('A meta está cancelada, não é possível investir na mesma')
        }
        this.progressValue += quantity
        if(this.progressValue > this.value){
            this.progressValue -= quantity
            throw new Error('O valor incrementado na meta excede seu valor total')
        }
        if(this.progressValue === this.value){
            this.complete()
        }
    }

    public decrementProgress(quantity: number){
        if(this.goalIsCompleted()){
            throw new Error('A meta já foi completa, portanto não é possível recuperar os investimentos')
        }
        if(quantity > this.progressValue){
            throw new Error('O valor decrementado é maior que o valor de progresso da meta')
        }
        this.progressValue -= quantity
    }

    public cancelAndRecoverInvestments(){
        if(this.goalIsCompleted()){
            throw new Error('A meta já foi completa e não pode mais ser cancelada')
        }
        this.isCanceled = true
        this.canceledAt = getCurrentStringDatetime()
        const recoveredInvestments = this.progressValue
        this.decrementProgress(recoveredInvestments)
        return recoveredInvestments
    }

    public reclaimRewards(){
        if(!this.goalIsCompleted()){
            throw new Error('Não foi possível obter as recompensas, a meta ainda não foi concluída')
        }
    }

    private complete(){
        this.isCompleted = true
        this.completedAt = getCurrentStringDatetime()
    }
}