import UserFinanceDAO, { UserFinanceDAOType } from "../DAO/UserFinanceDAO"

export interface UserFinanceTypeFields {
    userId: number,
    balance: number,
    totalSavings: number,
    currentSavings: number
}

export interface UserFinanceType extends UserFinanceTypeFields{
    UserFinanceDAO: UserFinanceDAOType
    save: () => Promise<void>,
    incrementBalance: (value: number) => void,
    decrementBalance: (value: number) => void,
    convertToObject: () => object
}

export default class UserFinance implements UserFinanceType {
    private userId
    private balance
    private totalSavings
    private currentSavings
    private UserFinanceDAO

    constructor({userId, balance, totalSavings, currentSavings}: UserFinanceTypeFields){
        this.userId = userId
        this.balance = balance
        this.totalSavings = totalSavings
        this.currentSavings = currentSavings
        this.UserFinanceDAO = new UserFinanceDAO()
    }

    async save() {
        this.UserFinanceDAO.replace({
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

    public convertToObject(){
        return {
            userId: this.userId,
            balance: this.balance,
            totalSavings: this.totalSavings,
            currentSavings: this.currentSavings
        }
    }

    static getFinancesByUserId(userId: number)

}