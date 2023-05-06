export type TransactionType = {
    userId: number
    description: string
    value: number
    isCanceled: boolean
    canceledAt?: string
}

export default class Transaction {
    protected userId: number
    protected description: string
    protected value: number
    protected isCanceled: boolean
    protected canceledAt?: string
    
    constructor(params: TransactionType){
        this.userId = params.userId
        this.description = params.description
        this.value = params.value
        this.isCanceled = params.isCanceled
        this.canceledAt = params.canceledAt
    }
}