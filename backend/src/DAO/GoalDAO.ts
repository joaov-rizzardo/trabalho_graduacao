import { FieldPacket } from "mysql2/promise";
import { ResultSetHeaderType, query } from "../Services/Database";
import { convertDateObjectDatetimeToString } from "../Utils/DateUtils";

type GoalTableType = {
    goalId: number,
    userId: number,
    description: string,
    value: string,
    progressValue: string,
    createdAt: Date,
    isCanceled: number,
    canceledAt: Date | null,
    isCompleted: number,
    completedAt: Date | null,
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
        return {
            goalId: goalData.goalId,
            userId: goalData.userId,
            description: goalData.description,
            value: parseFloat(goalData.value),
            progressValue: parseFloat(goalData.progressValue),
            createdAt: convertDateObjectDatetimeToString(goalData.createdAt),
            isCanceled: Boolean(goalData.isCanceled),
            canceledAt: goalData.canceledAt !== null ? convertDateObjectDatetimeToString(goalData.canceledAt) : undefined,
            isCompleted: Boolean(goalData.isCompleted),
            completedAt: goalData.completedAt !== null ? convertDateObjectDatetimeToString(goalData.completedAt) : undefined
        }
    }

    public async findAllUserGoals(userId: number){
        const response = await query(`SELECT * FROM UserGoals WHERE userId = ? AND isCanceled = 0`, [userId]) as [GoalTableType[], FieldPacket[]]
        const recoveredGoals = response[0]
        return recoveredGoals.map(goal => {
            return {
                goalId: goal.goalId,
                userId: goal.userId,
                description: goal.description,
                value: parseFloat(goal.value),
                progressValue: parseFloat(goal.progressValue),
                createdAt: convertDateObjectDatetimeToString(goal.createdAt),
                isCanceled: Boolean(goal.isCanceled),
                canceledAt: goal.canceledAt !== null ? convertDateObjectDatetimeToString(goal.canceledAt) : undefined,
                isCompleted: Boolean(goal.isCompleted),
                completedAt: goal.completedAt !== null ? convertDateObjectDatetimeToString(goal.completedAt) : undefined
            }
        })
    }
}