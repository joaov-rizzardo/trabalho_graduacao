import { FieldPacket } from 'mysql2';
import { ResultSetHeaderType } from './../Services/Database';
import { query } from "../Services/Database"

export type UserTableType = {
    userId: number
    username: string
    password: string
    email: string
    name: string
    lastName: string
    selectedAvatar: number
    isValidatedEmail: boolean
    createdAt: string
}

type UserUpdateType = {
    userId: number
    username: string
    password: string
    email: string
    name: string
    lastName: string
    isValidatedEmail: boolean
    selectedAvatar: number
}

type UserInsertType = {
    username: string
    password: string
    email: string
    name: string
    lastName: string
    isValidatedEmail: boolean
    selectedAvatar: number
}

export default class UserDAO {

    public async insertAndReturnId(user: UserInsertType){
        const response = await query(`
            INSERT INTO 
                User 
            SET 
                username = ?, 
                password = ?, 
                email = ?, 
                name = ?,
                lastName = ?,
                selectedAvatar = ?,
                isValidatedEmail = ?`,
            [
                user.username, 
                user.password, 
                user.email, 
                user.name, 
                user.lastName, 
                user.selectedAvatar,
                user.isValidatedEmail
            ]
        ) as [ResultSetHeaderType, FieldPacket[]]
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(user: UserUpdateType){
        if(user.userId === undefined){
            throw new Error('Não foi possível atualizar o usuário, o ID não foi informado')
        }
        await query(`
            UPDATE
                User
            SET
                username = ?,
                password = ?,
                email = ?,
                name = ?,
                lastName = ?,
                selectedAvatar = ?,
                isValidatedEmail = ?
            WHERE
                userId = ?`,
            [
                user.username, 
                user.password, 
                user.email,
                user.name, 
                user.lastName, 
                user.selectedAvatar,
                user.isValidatedEmail,
                user.userId
            ]
        )
    }

    public async updateProfile(profileInfo: {userId: number, name: string, lastName: string, selectedAvatar: number}){
        await query(`
            UPDATE
                User
            SET
                name = ?,
                lastName = ?,
                selectedAvatar = ?
            WHERE
                userId = ?`,
            [profileInfo.name, profileInfo.lastName, profileInfo.selectedAvatar, profileInfo.userId]
        )
    }

    public async getUserById(userId: number){
        const response = await query(`SELECT * FROM User WHERE userId = ?`, [userId]) as [UserTableType[], FieldPacket[]]
        const userData = response[0][0]
        if(!userData){
            return false
        }
        return {
            userId: userData.userId,
            username: userData.username,
            password: userData.password,
            email: userData.email,
            name: userData.name,
            lastName: userData.lastName,
            selectedAvatar: userData.selectedAvatar,
            isValidatedEmail: userData.isValidatedEmail,
            createdAt: userData.createdAt
        }
    }

    public async getUserByField(field: string, value: string){
        const response = await query(`SELECT * FROM User WHERE ${field} = ?`, [value]) as [UserTableType[], FieldPacket[]]
        const userData = response[0][0]
        if(!userData){
            return false
        }
        return {
            userId: userData.userId,
            username: userData.username,
            password: userData.password,
            email: userData.email,
            name: userData.name,
            lastName: userData.lastName,
            selectedAvatar: userData.selectedAvatar,
            isValidatedEmail: userData.isValidatedEmail,
            createdAt: userData.createdAt
        }
    }

    public async insertEmailVerificationCodeToUser({userId, code, sentAt}: {userId: number, code: string, sentAt: string}){
        const response = await query(`INSERT INTO UserEmailCodes SET userId = ?, code = ?, sentAt = ?`, 
            [userId, code, sentAt]
        ) as [ResultSetHeaderType, FieldPacket[]]
    }

    public async getLastSentCode(userId: number){
        const response = await query(`SELECT code, sentAt FROM UserEmailCodes WHERE userId = ? ORDER BY sentAt DESC LIMIT 1`, [userId]) as [{code: string, sentAt: string}[], FieldPacket[]]
        const responseData = response[0][0]
        if(!responseData){
            return false
        }else{
            return {
                code: responseData.code,
                sentAt: responseData.sentAt
            }
        }
    }
}