import { FieldPacket } from "mysql2"
import { query } from "../Services/Database"

export type UserFinanceTableType = {
    userId: number
    balance: string,
    totalSavings: string
    currentSavings: string
}

export type UserFinanceReplaceType = {
    userId: number
    balance: number,
    totalSavings: number
    currentSavings: number
}

export default class UserFinanceDAO {

    public async replace({userId, balance, totalSavings, currentSavings}: UserFinanceReplaceType) {
         await query("REPLACE INTO UserFinances SET userId = ?, balance = ?, totalSavings = ?, currentSavings = ?", [
            userId, balance, totalSavings, currentSavings
        ])
    }
    
    public async getFinancesByUserId(userId: number){
        const response = await query("SELECT * FROM UserFinances WHERE userId = ?", [userId]) as [UserFinanceTableType[], FieldPacket[]]
        const recoveredFinance = response[0][0]
        if(!recoveredFinance){
            throw new Error(`Nenhuma finança foi encontrada para o usuário informado: ${userId}`)
        }
        return {
            userId: recoveredFinance.userId,
            balance: parseFloat(recoveredFinance.balance),
            totalSavings: parseFloat(recoveredFinance.totalSavings),
            currentSavings: parseFloat(recoveredFinance.currentSavings)
        }
    }
}