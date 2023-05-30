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
        ) as [ResultSetHeaderType, undefined] | false
        if(!response){
            throw new Error('Não foi possível realizar a inserção do usuário no banco de dados')
        }
        const insertedId = response[0].insertId
        return insertedId
    }

    public async update(user: UserUpdateType){
        if(user.userId === undefined){
            throw new Error('Não foi possível atualizar o usuário, o ID não foi informado')
        }
        const response = await query(`
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

        if(!response){
            throw new Error('Não foi possível realizar a atualização do usuário no banco de dados')
        }
    }

    public async updateProfile(profileInfo: {userId: number, email: string, name: string, lastName: string}){
        const response = await query(`
            UPDATE
                User
            SET
                email = ?,
                name = ?,
                lastName = ?
            WHERE
                userId = ?`,
            [profileInfo.email, profileInfo.name, profileInfo.lastName, profileInfo.userId]
        )
        if(!response){
            throw new Error('Não foi possível atualizar o perfil no banco de dados')
        }
    }

    public async getUserById(userId: number){
        const response = await query(`SELECT * FROM User WHERE userId = ?`, [userId]) as [UserTableType[], FieldPacket[]] | false
        if(!response){
            throw new Error('Não foi possível recuperar o usuário do banco de dados')
        }
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
        const response = await query(`SELECT * FROM User WHERE ${field} = ?`, [value]) as [UserTableType[], FieldPacket[]] | false
        if(!response){
            throw new Error('Não foi possível recuperar o usuário do banco de dados')
        }
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
}