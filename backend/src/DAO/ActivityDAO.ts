import { FieldPacket } from "mysql2/promise";
import { ResultSetHeaderType, query } from "../Services/Database";
import { convertDateObjectDatetimeToString } from "../Utils/DateUtils";

type ActivityTableFieldsType = {
    activityId: number
    userId: number
    description: string
    createdAt: Date
}

type ActivityInsertType = {
    userId: number
    description: string
    createdAt: string
}

type ActivityUpdateType = {
    activityId: number
    userId: number
    description: string
    createdAt: string
}

export default class ActivityDAO {
    public async insertAndReturnId({userId, description, createdAt}: ActivityInsertType){
        const response = await query(`
            INSERT INTO
                UserActivity
            SET
                userId = ?,
                description = ?,
                createdAt = ?
            `,
            [
                userId, description, createdAt
            ]
        ) as [ResultSetHeaderType, FieldPacket[]]
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(params: ActivityUpdateType){
        await query(`
            UPDATE
                UserActivity
            SET
                userId = ?,
                description = ?,
                createdAt = ?
            WHERE
                activityId = ?
            `,
            [
                params.userId,
                params.description,
                params.createdAt,
                params.activityId
            ]
        )
    }

    public async findById(activityId: number){
        const response = await query(`SELECT * FROM UserActivity WHERE activityId = ?`, [activityId]) as [ActivityTableFieldsType[], FieldPacket[]]
        const activityData = response[0][0]
        if(!activityData){
            throw new Error(`Nenhuma atividade foi encontrada para o ID: ${activityId}`)
        }
        return {
            activityId: activityData.activityId,
            userId: activityData.userId,
            description: activityData.description,
            createdAt: convertDateObjectDatetimeToString(activityData.createdAt) 
        }
    }

    public async findLastHundredActivitys(userId: number){
        const response = await query(`SELECT * FROM UserActivity WHERE userId = ? ORDER BY createdAt DESC LIMIT 100`, [userId]) as [ActivityTableFieldsType[], FieldPacket[]]
        const recoveredActivitys = response[0]
        return recoveredActivitys.map(activity => {
            return {
                activityId: activity.activityId,
                userId: activity.userId,
                description: activity.description,
                createdAt: convertDateObjectDatetimeToString(activity.createdAt) 
            }
        })
    }

    public async findAllActivitys(userId: number){
        const response = await query(`SELECT * FROM UserActivity WHERE userId = ?`, [userId]) as [ActivityTableFieldsType[], FieldPacket[]]
        const recoveredActivitys = response[0]
        return recoveredActivitys.map(activity => {
            return {
                activityId: activity.activityId,
                userId: activity.userId,
                description: activity.description,
                createdAt: convertDateObjectDatetimeToString(activity.createdAt) 
            }
        })
    }
}