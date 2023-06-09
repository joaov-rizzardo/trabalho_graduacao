import { FieldPacket } from "mysql2/promise"
import { AchievementTypeEnum } from "../Enums/AchievementTypeEnum"
import { ResultSetHeaderType, query } from "../Services/Database"

type AchievementInsertType = {
    typeId: keyof typeof AchievementTypeEnum,
    name: string,
    description: string,
    xpReward: number,
    pointReward: number,
    medalReward?: number,
    goal: number,
    createdAt?: string
}

type AchievementUpdateType = {
    achievementId: number,
    typeId: keyof typeof AchievementTypeEnum,
    name: string,
    description: string,
    xpReward: number,
    pointReward: number,
    medalReward?: number,
    goal: number,
    createdAt?: string
}

type AchievementTableType = {
    achievementId: number,
    typeId: keyof typeof AchievementTypeEnum,
    name: string,
    description: string,
    xpReward: number,
    pointReward: number,
    medalReward?: number,
    goal: number,
    createdAt: string
}
export default class AchievementDAO {
    public async insertAndReturnId(params: AchievementInsertType){
        const response = await query(`
            INSERT INTO
                Achievements
            SET
                typeId = ?,
                name = ?,
                description = ?,
                xpReward = ?,
                pointReward = ?,
                medalReward = ?,
                goal = ?,
                createdAt = ?
            `,
            [
                params.typeId,
                params.name,
                params.description,
                params.xpReward,
                params.pointReward,
                params.medalReward,
                params.goal,
                params.createdAt
            ]
        ) as [ResultSetHeaderType, FieldPacket[]]
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(params: AchievementUpdateType){
        await query(`
            UPDATE
                Achievements
            SET
                typeId = ?,
                name = ?,
                description = ?,
                xpReward = ?,
                pointReward = ?,
                medalReward = ?,
                goal = ?,
                createdAt = ?
            WHERE
                achievementId = ?
            `,
            [
                params.typeId,
                params.name,
                params.description,
                params.xpReward,
                params.pointReward,
                params.medalReward,
                params.goal,
                params.createdAt,
                params.achievementId
            ]
        )
    }

    public async findById(achievementId: number){
        const response = await query(`SELECT * FROM Achievements WHERE achievementId = ?`, [achievementId]) as [AchievementTableType[], FieldPacket[]]
        const achievementData = response[0][0]
        if(!achievementData){
            throw new Error(`Nenhum ganho foi encontrada para o ID: ${achievementId}`)
        }
        return achievementData
    }

    public async findByUserId(userId: number){
        const response = await query(`
            SELECT 
                a.* 
            FROM 
                UserAchievements AS u 
            INNER JOIN
                Achievements AS a ON u.achievementId = a.achievementId
            WHERE
                u.userId = ?
            `,
            [userId]
        ) as [AchievementTableType[], FieldPacket[]]
        const achievementData = response[0]
        return achievementData
    }
}