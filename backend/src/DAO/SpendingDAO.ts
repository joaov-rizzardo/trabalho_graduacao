import { FieldPacket } from "mysql2/promise";
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";
import { ResultSetHeaderType, query } from "../Services/Database";

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
    value: number,
    spentAt: string,
    isCanceled: boolean,
    canceledAt: string
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
        ) as [ResultSetHeaderType, undefined] | false
        if(response === false){
            throw new Error(`Não foi possível inserir um gasto para o usuário: ${params.userId}`)
        }
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(params: SpendingUpdateType){
        const response = await query(`
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
        if(!response){
            throw new Error(`Não foi possível atualizar o gasto de id: ${params.spendingId}`)
        }
    }

    public async findById(spendingId: number){
        const response = await query(`SELECT * FROM UserSpendings WHERE spendingId = ?`, [spendingId]) as [SpendingTableType[], FieldPacket[]] | false
        if(response === false){
            throw new Error(`Não foi possível recuperar o gasto pelo id: ${spendingId}`)
        }
        const spendingData = response[0][0]
        if(!spendingData){
            throw new Error(`Nenhum gasto foi encontrada para o ID: ${spendingId}`)
        }
        return spendingData
    }
}