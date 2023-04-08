import { query } from "../Services/Database"

export type UserLevelTableType = {
    userId: number
    currentLevel: number
    currentXp: number
    points: number
}

export type UserLevelDAOType =  {
    replace: ({}: UserLevelTableType) => Promise<void>
}

export default class UserLevelDAO implements UserLevelDAOType{
    public async replace({userId, currentLevel, currentXp, points}: UserLevelTableType){
        const response = await query("REPLACE INTO UserLevel SET userId = ?, currentLevel = ?, currentXp = ?, points = ?", [
            userId,
            currentLevel,
            currentXp,
            points
        ])
        if(response === false){
            throw new Error('Não foi possível salvar as informações do level do usuário')
        }
    }
}