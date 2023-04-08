import { UserFinanceTypeFields } from "../Models/UserFinance"
import { query } from "../Services/Database"

export type UserFinanceDAOType = {
    replace: ({}: UserFinanceTypeFields) => Promise<void>
    getFinancesByUserId: (userId: number) => Promise<UserFinanceTypeFields>
}

export default class UserFinanceDAO implements UserFinanceDAOType {
    public async replace({userId, balance, totalSavings, currentSavings}: UserFinanceTypeFields) {
        const response = await query("REPLACE INTO UserFinances SET userId = ?, balance = ?, totalSavings = ?, currentSavings = ?", [
            userId, balance, totalSavings, currentSavings
        ])
        if(!response){
            throw new Error('Ocorreu um erro ao salvar as finanças do usuário.')
        }
    }
    
    static async getFinancesByUserId(userId: number){
        const response = await query("SELECT * FROM UserFinances WHERE userId = ?", [userId])

    }
}