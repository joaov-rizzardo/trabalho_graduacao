import { FieldPacket } from "mysql2/promise";
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";
import { ResultSetHeaderType, query } from "../Services/Database";
import { convertDateObjectDatetimeToString } from "../Utils/DateUtils";

type SpendingInsertType = {
    userId: number,
    description: string,
    category: keyof typeof SpendingCategoryEnum,
    value: number,
    spentAt?: string,
    isCanceled: boolean,
    canceledAt?: string
}

type SpendingUpdateType = {
    spendingId: number
    userId: number,
    description: string,
    category: keyof typeof SpendingCategoryEnum,
    value: number,
    spentAt?: string,
    isCanceled: boolean,
    canceledAt?: string
}

type SpendingTableType = {
    spendingId: number
    userId: number,
    description: string,
    category: keyof typeof SpendingCategoryEnum,
    value: string,
    spentAt: Date,
    isCanceled: number,
    canceledAt: Date | null
}
export default class SpendingDAO {
    public async insertAndReturnId(params: SpendingInsertType){
        const response = await query(`
            INSERT INTO
                UserSpendings
            SET
                userId = ?,
                description = ?,
                category = ?,
                value = ?,
                spentAt = ?,
                isCanceled = ?,
                canceledAt = ?
            `,
            [
                params.userId,
                params.description,
                params.category,
                params.value,
                params.spentAt,
                params.isCanceled,
                params.canceledAt
            ]
        ) as [ResultSetHeaderType, FieldPacket[]]
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(params: SpendingUpdateType){
        await query(`
            UPDATE
                UserSpendings
            SET
                userId = ?,
                description = ?,
                category = ?,
                value = ?,
                spentAt = ?,
                isCanceled = ?,
                canceledAt = ?
            WHERE
                spendingId = ?
            `,
            [
                params.userId,
                params.description,
                params.category,
                params.value,
                params.spentAt,
                params.isCanceled,
                params.canceledAt,
                params.spendingId
            ]
        )
    }

    public async findById(spendingId: number){
        const response = await query(`SELECT * FROM UserSpendings WHERE spendingId = ?`, [spendingId]) as [SpendingTableType[], FieldPacket[]]
        const spendingData = response[0][0]
        if(!spendingData){
            throw new Error(`Nenhum gasto foi encontrada para o ID: ${spendingId}`)
        }
        return {
            spendingId: spendingData.spendingId,
            userId: spendingData.userId,
            description: spendingData.description,
            category: spendingData.category,
            value: parseFloat(spendingData.value),
            spentAt: convertDateObjectDatetimeToString(spendingData.spentAt),
            isCanceled: Boolean(spendingData.isCanceled),
            canceledAt: spendingData.canceledAt !== null ? convertDateObjectDatetimeToString(spendingData.canceledAt) : undefined
        }
    }

    public async getUserSpendingsQuantityByDate(userId: number, date: string){
        const response = await query(`
            SELECT 
                COUNT(*) as quantity
            FROM 
                UserSpendings 
            WHERE 
                userId = ? 
                AND spentAt BETWEEN ? AND ?`,
            [
                userId,
                `${date} 00:00:00`,
                `${date} 23:59:59`
            ]
        ) as [{quantity: number}[], FieldPacket[]]
        const quantity = response[0][0].quantity
        return quantity
    }

    public async findByFilters({userId, startDate, finishDate}: {userId: number, startDate?: string, finishDate?: string}){
        const params: Array<number|string> = [userId]
        let sql = `SELECT * FROM UserSpendings WHERE userId = ?`
        if(startDate !== undefined && finishDate !== undefined){
            sql += " AND spentAt BETWEEN ? AND ?"
            params.push(startDate)
            params.push(finishDate)
        }
        const response = await query(sql, params) as [SpendingTableType[], FieldPacket[]]
        const spendingData = response[0]
        return spendingData.map(spending => {
            return {
                spendingId: spending.spendingId,
                userId: spending.userId,
                description: spending.description,
                category: spending.category,
                value: parseFloat(spending.value),
                spentAt: convertDateObjectDatetimeToString(spending.spentAt),
                isCanceled: Boolean(spending.isCanceled),
                canceledAt: spending.canceledAt !== null ? convertDateObjectDatetimeToString(spending.canceledAt) : undefined
            }
        })
    }

    public async getSpendingsByCategory({userId, startDate, finishDate}: {userId: number, startDate?: string, finishDate?: string}){
        let sql = `SELECT SUM(value) AS value, category FROM vw_spending_by_category WHERE userId = ?`
        const params: Array<string|number> = []
        params.push(userId)
        if(startDate !== undefined && finishDate !== undefined){
            sql += ` AND spendingDate BETWEEN ? AND ?`
            params.push(`${startDate} 00:00:00`)
            params.push(`${finishDate} 23:59:59`)
        }
        sql += ` GROUP BY category`
        const response = await query(sql, params) as [{value: string, category: keyof typeof SpendingCategoryEnum}[], FieldPacket[]]
        return response[0].map(spending => {
            return {
                value: parseFloat(spending.value),
                category: spending.category
            }
        })
    }
    public async getAllSpendingsByFilters({userId, startDate, finishDate}: {userId: number, startDate?: string, finishDate?: string}){
        let sql = `SELECT value, category, spendingDate FROM vw_spending_by_category WHERE userId = ?`
        const params: Array<string|number> = []
        params.push(userId)
        if(startDate !== undefined && finishDate !== undefined){
            sql += ` AND spendingDate BETWEEN ? AND ?`
            params.push(`${startDate} 00:00:00`)
            params.push(`${finishDate} 23:59:59`)
        }
        const response = await query(sql, params) as [{value: string, category: keyof typeof SpendingCategoryEnum, spendingDate: Date}[], FieldPacket[]]
        return response[0].map(spending => {
            return {
                value: parseFloat(spending.value),
                category: spending.category,
                spendingDate: convertDateObjectDatetimeToString(spending.spendingDate)
            }
        })
    }
}