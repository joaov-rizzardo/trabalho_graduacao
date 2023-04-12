import { FieldPacket } from "mysql2"
import { query } from "../Services/Database"

export type UserFinanceDAOType = {
    replace: ({}: UserFinanceTableType) => Promise<void>
    getFinancesByUserId: (userId: number) => Promise<UserFinanceTableType>
}

export type UserFinanceTableType = {
    userId: number
    balance: number,
    totalSavings: number
    currentSavings: number
}

export default class UserFinanceDAO implements UserFinanceDAOType {

    public async replace({userId, balance, totalSavings, currentSavings}: UserFinanceTableType) {
        const response = await query("REPLACE INTO UserFinances SET userId = ?, balance = ?, totalSavings = ?, currentSavings = ?", [
            userId, balance, totalSavings, currentSavings
        ])
        if(!response){
            throw new Error('Ocorreu um erro ao salvar as finanças do usuário.')
        }
    }
    
    public async getFinancesByUserId(userId: number){
        const response = await query("SELECT * FROM UserFinances WHERE userId = ?", [userId]) as [UserFinanceTableType[], FieldPacket[]] | false
        if(!response){
            throw new Error('Não foi possível realizar a busca da finança no banco de dados')
        }
        const recoveredFinance = response[0][0]
        if(!recoveredFinance){
            throw new Error(`Nenhuma finança foi encontrada para o usuário informado: ${userId}`)
        }
        return {
            userId: recoveredFinance.userId,
            balance: recoveredFinance.balance,
            totalSavings: recoveredFinance.totalSavings,
            currentSavings: recoveredFinance.currentSavings
        }
    }
}