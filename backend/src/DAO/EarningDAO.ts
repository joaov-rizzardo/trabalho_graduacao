import { ResultSetHeaderType } from './../Services/Database';
import { EarningCategoryEnum } from "../Enums/EarningCategoryEnum"
import { query } from "../Services/Database"
import { FieldPacket } from 'mysql2/promise';

type EarningInsertType = {
    userId: number,
    description: string,
    category: keyof typeof EarningCategoryEnum,
    value: number,
    earnedAt?: string,
    isCanceled: boolean,
    canceledAt?: string,
}

type EarningUpdateType = {
    earningId: number,
    userId: number,
    description: string,
    category: keyof typeof EarningCategoryEnum,
    value: number,
    earnedAt?: string,
    isCanceled: boolean,
    canceledAt?: string,
}

type EarningTableType = {
    earningId: number,
    userId: number,
    description: string,
    category: keyof typeof EarningCategoryEnum,
    value: number,
    earnedAt: string,
    isCanceled: boolean,
    canceledAt: string,
}

export default class EarningDAO {
    public async insertAndReturnId(params: EarningInsertType){
        const response = await query(`
            INSERT INTO
                UserEarnings
            SET
                userId = ?,
                description = ?,
                category = ?,
                value = ?,
                earnedAt = ?,
                isCanceled = ?,
                canceledAt = ?
            `,
            [
                params.userId,
                params.description,
                params.category,
                params.value,
                params.earnedAt,
                params.isCanceled,
                params.canceledAt
            ]
        ) as [ResultSetHeaderType, undefined] | false
        if(response === false){
            throw new Error(`Não foi possível inserir um ganho para o usuário: ${params.userId}`)
        }
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(params: EarningUpdateType){
        const response = await query(`
            UPDATE
                UserEarnings
            SET
                userId = ?,
                description = ?,
                category = ?,
                value = ?,
                earnedAt = ?,
                isCanceled = ?,
                canceledAt = ?
            WHERE
                earningId = ?
            `,
            [
               params.userId,
               params.description,
               params.category,
               params.value,
               params.earnedAt,
               params.isCanceled,
               params.canceledAt,
               params.earningId 
            ]
        )
        if(!response){
            throw new Error(`Não foi possível atualizar o ganho de id: ${params.earningId}`)
        }
    }

    public async findById(earningId: number){
        const response = await query(`SELECT * FROM UserEarnings WHERE earningId  = ?`, [earningId]) as [EarningTableType[], FieldPacket[]] | false
        if(response === false){
            throw new Error(`Não foi possível recuperar o ganho pelo id: ${earningId}`)
        }
        const earningData = response[0][0]
        if(!earningData){
            throw new Error(`Nenhum ganho foi encontrada para o ID: ${earningId}`)
        }
        return earningData
    }
}