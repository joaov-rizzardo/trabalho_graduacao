import { FieldPacket } from "mysql2/promise"
import { ResultSetHeaderType, query } from "../Services/Database"

export type AvatarTableFields = {
    avatarId: number
    name: string
    createdAt: string
}

type AvatarInsertType = {
    name: string
    createdAt: string
}

type AvatarUpdateType = {
    avatarId: number
    name: string
}

export default class AvatarDAO {
    public async insertAndReturnId({name, createdAt}: AvatarInsertType){
        const response = await query(`
            INSERT INTO
                Avatar
            SET
                name = ?,
                createdAt = ?
        `, 
            [
                name,
                createdAt
            ]
        ) as [ResultSetHeaderType, FieldPacket[]]
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update({avatarId, name}: AvatarUpdateType){
        await query(`
            UPDATE
                Avatar
            SET
                name = ?
            WHERE
                avatarId = ?
            `,
            [
                name,
                avatarId
            ]
        )
    }

    public async insertToUser({userId, avatarId}: {userId: number, avatarId: number}){
        await query(`
            INSERT INTO
                UserAvatars
            SET
                avatarId = ?,
                userId = ?
            `,
            [
                avatarId,
                userId
            ]
        )
    }

    public async getAvatarById(avatarId: number){
        const response = await query(`
            SELECT
                avatarId,
                name,
                createdAt
            FROM
                Avatar
            WHERE
                avatarId = ?
        `, [avatarId]) as [AvatarTableFields[], FieldPacket[]]
        const recoveredAvatar = response[0][0]
        if(!recoveredAvatar){
            throw new Error(`Nenhum avatar foi encontrado para o id: ${recoveredAvatar}`)
        }
        return {
            avatarId: recoveredAvatar.avatarId,
            name: recoveredAvatar.name,
            createdAt: recoveredAvatar.createdAt
        }
    }

    public async getUserAvatars(userId: number){
        const response = await query(`
            SELECT
                a.avatarId,
                a.name,
                a.createdAt
            FROM
                Avatar as a
            INNER JOIN
                UserAvatars as u ON u.avatarId = a.avatarId
            WHERE
                u.userId = ?
        `, [userId]) as [AvatarTableFields[], FieldPacket[]]
        const recoveredAvatar = response[0]
        return recoveredAvatar.map(avatar => {
            return {
                avatarId: avatar.avatarId,
                name: avatar.name,
                createdAt: avatar.createdAt
            }
        })
    }

    public static async getAllAvatars(){
        const response = await query(`SELECT avatarId, name, createdAt FROM Avatar`, ) as [AvatarTableFields[], FieldPacket[]]
        const recoveredsAvatar = response[0]
        return recoveredsAvatar.map(avatar => {
            return {
                avatarId: avatar.avatarId,
                name: avatar.name,
                createdAt: avatar.createdAt
            }
        })
    }
}