import { ResultSetHeaderType, query } from "../Services/Database";

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
                createAt = ?,
            `,
            [
                userId, description, createdAt
            ]
        ) as [ResultSetHeaderType, undefined] | false
        if(response === false){
            throw new Error('Não foi possível realizar a inserção da atividade no banco de dados')
        }
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(params: ActivityUpdateType){
        const response = await query(`
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
        if(response === false){
            throw new Error(`Não foi possível atualizar a atividade ID: ${params.activityId}`)
        }
    }
}