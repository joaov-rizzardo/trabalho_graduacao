import UserFinanceDAO from "../DAO/UserFinanceDAO"

export interface UserFinanceTypeFields {
    userId: number,
    balance: number,
    totalSavings: number,
    currentSavings: number
}

export default class UserFinance {
    private userId: number
    private balance: number
    private totalSavings: number
    private currentSavings: number
    private userFinanceDAO: UserFinanceDAO

    constructor({userId, balance, totalSavings, currentSavings}: UserFinanceTypeFields){
        this.userId = userId
        this.balance = balance
        this.totalSavings = totalSavings
        this.currentSavings = currentSavings
        this.userFinanceDAO = new UserFinanceDAO()
    }

    public async save() {
        await this.userFinanceDAO.replace({
            userId: this.userId,
            balance: this.balance,
            totalSavings: this.totalSavings,
            currentSavings: this.currentSavings
        })
    }

    public incrementBalance(value: number){
        this.balance += value
    }

    public decrementBalance(value: number){
        this.balance -= value
    }

    public incrementTotalSavings(value: number){
        this.totalSavings += value
    }

    public decrementTotalSavings(value: number){
        this.totalSavings -= value
    }

    public incrementCurrentSavings(value: number){
        this.currentSavings += value
    }

    public decrementCurrentSavings(value: number){
        this.currentSavings -= value
    }

    public convertToObject(){
        return {
            userId: this.userId,
            balance: this.balance,
            totalSavings: this.totalSavings,
            currentSavings: this.currentSavings
        }
    }

    static async getInstanceByUserId(userId: number){
        const financeDAO = new UserFinanceDAO()
        const recoveredFinance = await financeDAO.getFinancesByUserId(userId)
        return new this({
            userId: recoveredFinance.userId,
            balance: recoveredFinance.balance,
            totalSavings: recoveredFinance.totalSavings,
            currentSavings: recoveredFinance.currentSavings
        })
    }

}