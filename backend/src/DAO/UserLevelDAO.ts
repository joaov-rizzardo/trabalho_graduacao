import { FieldPacket } from "mysql2/promise"
import { query } from "../Services/Database"

export type UserLevelTableType = {
    userId: string
    currentLevel: string
    currentXp: string
    points: string
}

export type UserLevelReplaceType = {
    userId: number
    currentLevel: number
    currentXp: number
    points: number
}

export default class UserLevelDAO{
    public async replace({userId, currentLevel, currentXp, points}: UserLevelReplaceType){
        const response = await query("REPLACE INTO UserLevel SET userId = ?, currentLevel = ?, currentXp = ?, points = ?", [
            userId,
            currentLevel,
            currentXp,
            points
        ])
        if(!response){
            throw new Error('Não foi possível salvar as informações do level do usuário')
        }
    }

    public async getLevelByUserId(userId: number){
        const response = await query("SELECT * FROM UserLevel WHERE userId = ?", [userId]) as [UserLevelTableType[], FieldPacket[]] | false
        if(!response){
            throw new Error('Não foi possível obter as informações de level do usuário do banco de dados')
        }
        const recoveredLevel = response[0][0]
        if(!recoveredLevel){
            throw new Error(`Nenhuma informação de level foi encontrada para o usuário informado: ${userId}`)
        }
        return {
            userId: parseInt(recoveredLevel.userId),
            currentLevel: parseInt(recoveredLevel.currentLevel),
            currentXp: parseInt(recoveredLevel.currentXp),
            points: parseInt(recoveredLevel.points)
        }
    }
}