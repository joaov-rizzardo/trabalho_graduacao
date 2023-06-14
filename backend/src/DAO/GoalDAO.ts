import { FieldPacket } from "mysql2/promise";
import { ResultSetHeaderType, query } from "../Services/Database";

type GoalTableType = {
    goalId: number,
    userId: number,
    description: string,
    value: number,
    progressValue: number,
    createdAt: string,
    isCanceled: boolean,
    canceledAt: string,
    isCompleted: boolean,
    completedAt: string,
}
type GoalInsertType = {
    userId: number
    description: string
    value: number
    progressValue: number
    createdAt: string
    isCanceled: boolean
    isCompleted: boolean
}

type GoalUpdateType = {
    goalId: number,
    userId: number,
    description: string,
    value: number,
    progressValue: number,
    createdAt: string,
    isCanceled: boolean,
    canceledAt?: string,
    isCompleted: boolean,
    completedAt?: string
}
export default class GoalDAO {
    public async insertAndReturnId(params: GoalInsertType){
        const response = await query(`
            INSERT INTO
                UserGoals
            SET
                userId = ?,
                description = ?,
                value = ?,
                progressValue = ?,
                createdAt = ?,
                isCanceled = ?,
                isCompleted = ?
            `,
            [
                params.userId,
                params.description,
                params.value,
                params.progressValue,
                params.createdAt,
                params.isCanceled,
                params.isCompleted
            ]
        ) as [ResultSetHeaderType, FieldPacket[]]
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(params: GoalUpdateType){
        await query(`
            UPDATE
                UserGoals
            SET
                userId = ?,
                description = ?,
                value = ?,
                progressValue = ?,
                createdAt = ?,
                isCanceled = ?,
                canceledAt = ?,
                isCompleted = ?,
                completedAt = ?
            WHERE
                goalId = ?
            `,
            [
                params.userId,
                params.description,
                params.value,
                params.progressValue,
                params.createdAt,
                params.isCanceled,
                params.canceledAt,
                params.isCompleted,
                params.completedAt,
                params.goalId
            ]
        )
    }

    public async findById(goalId: number){
        const response = await query(`SELECT * FROM UserGoals WHERE goalId = ?`, [goalId]) as [GoalTableType[], FieldPacket[]]
        const goalData = response[0][0]
        if(!goalData){
            throw new Error(`Nenhuma meta foi encontrada para o ID: ${goalId}`)
        }
        return goalData
    }

    public async findAllUserGoals(userId: number){
        const response = await query(`SELECT * FROM UserGoals WHERE userId = ?`, [userId]) as [GoalTableType[], FieldPacket[]]
        const recoveredGoals = response[0]
        return recoveredGoals
    }
}