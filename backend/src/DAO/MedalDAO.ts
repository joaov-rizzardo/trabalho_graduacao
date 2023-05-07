import { FieldPacket } from "mysql2/promise";
import { ResultSetHeaderType, query } from "../Services/Database";

type MedalInsertType = {
    name: string,
    filename: string,
    createdAt?: string
}

type MedalUpdateType = {
    medalId: number,
    name: string,
    filename: string,
    createdAt?: string
}

type MedalTableType = {
    medalId: number,
    name: string,
    filename: string,
    createdAt: string
}
export default class MedalDAO {
    public async insertMedalToUser(userId: number, medalId: number){
        const response = await query(`
            INSERT INTO
                UserMedals
            SET
                userId = ?,
                medalId = ?
            `,
            [userId, medalId]
        )
        if(!response){
            throw new Error(`Ocorreu um erro ao inserir a medalha ${medalId} para o usuário ${userId}`)
        }
    }

    public async insertAndReturnId({name, filename, createdAt}: MedalInsertType){
        const response = await query(`
            INSERT INTO
                Medals
            SET
                name = ?,
                filename = ?,
                createdAt = ?
            `,
            [name, filename, createdAt]
        ) as [ResultSetHeaderType, undefined] | false
        if(response === false){
            throw new Error(`Não foi possível inserir uma nova medalha`)
        }
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(params: MedalUpdateType){
        const response = await query(`
            UPDATE
                Medals
            SET
                name = ?,
                filename = ?,
                createdAt = ?
            WHERE
                medalId = ?
            `,
            [
                params.name,
                params.filename,
                params.createdAt,
                params.medalId
            ]
        )
        if(!response){
            throw new Error(`Não foi possível atualizar a medalha de ID: ${params.medalId}`)
        }
    }

    public async findMedalsByUserId(userId: number){
        const response = await query(`
            SELECT 
                m.* 
            FROM
                Medal as m
            INNER JOIN
                UserMedals AS u ON u.medalId = m.medalId
            WHERE
                u.userId = ?`,
            [userId]
        ) as [MedalTableType[], FieldPacket[]] | false
        if(response === false){
            throw new Error(`Não foi possível recuperar as medalhas para o usuário: ${userId}`)
        }
        const medalData = response[0]
        return medalData
    }

    public async findMedalById(medalId: number){
        const response = await query(`SELECT * FROM Medal WHERE medalId = ?`, [medalId]) as [MedalTableType[], FieldPacket[]] | false
        if(response === false){
            throw new Error(`Não foi possível recuperar a medalha de ID: ${medalId}`)
        }
        const medalData = response[0][0]
        if(!medalData){
            throw new Error(`Nenhuma medalha foi encontrada para o ID: ${medalId}`)
        }
        return medalData
    }
}