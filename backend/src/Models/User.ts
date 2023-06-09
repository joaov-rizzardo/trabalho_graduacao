import UserDAO from "../DAO/UserDAO"
import UserPasswordEncrypter from "./UserPasswordEncrypter"

export type UserType = {
    userId?: number,
    username: string,
    password: string,
    email: string,
    name: string,
    lastName: string,
    selectedAvatar: number,
    isValidatedEmail: boolean,
    createdAt?: string
}

type updateProfileType = {
    name?: string,
    lastName?: string,
    selectedAvatar?: number
}

export default class User {
    private userId?: number
    private username: string
    private password: string
    private email: string
    private name: string
    private lastName: string
    private selectedAvatar: number
    private isValidatedEmail: boolean
    private createdAt?: string
    private userDAO: UserDAO

    constructor(instanceParams: UserType){
        this.userId = instanceParams.userId
        this.username = instanceParams.username
        this.password = instanceParams.password
        this.email = instanceParams.email
        this.name = instanceParams.name
        this.lastName = instanceParams.lastName
        this.selectedAvatar = instanceParams.selectedAvatar
        this.isValidatedEmail = instanceParams.isValidatedEmail
        this.createdAt = instanceParams.createdAt
        this.userDAO = new UserDAO()
    }

    public async save(){
        if(this.isCreated()){
            await this.userDAO.update({
                userId: this.userId!,
                username: this.username,
                password: this.password,
                email: this.email,
                name: this.name,
                lastName: this.lastName,
                selectedAvatar: this.selectedAvatar,
                isValidatedEmail: this.isValidatedEmail
            })
        }else{
            await this.encryptPassword()
            this.userId  = await this.userDAO.insertAndReturnId({
                username: this.username,
                password: this.password,
                email: this.email,
                name: this.name,
                lastName: this.lastName,
                selectedAvatar: this.selectedAvatar,
                isValidatedEmail: this.isValidatedEmail
            })
        }
    }

    get getId(){
        return this.userId
    }

    public convertToObject(){
        return {
            userId: this.userId,
            username: this.username,
            password: this.password,
            email: this.email,
            name: this.name,
            lastName: this.lastName,
            selectedAvatar: this.selectedAvatar,
            isValidatedEmail: this.isValidatedEmail,
            createdAt: this.createdAt
        }
    }

    public async checkPassword(password: string){
        const encrypter = new UserPasswordEncrypter()
        return await encrypter.checkPassword(password, this.password)
    }
    
    public async updateProfile({name, lastName, selectedAvatar}: updateProfileType){
        if(this.userId === undefined){
            throw new Error('O perfil não pode ser atualizado, o usuário ainda não foi inserido no banco de dados')
        }
        if(name !== undefined){
            this.name = name
        }
        if(lastName !== undefined){
            this.lastName = lastName
        }
        if(selectedAvatar !== undefined){
            this.selectedAvatar = selectedAvatar
        }
        await this.userDAO.updateProfile({
            userId: this.userId,
            name: this.name,
            lastName: this.lastName,
            selectedAvatar: this.selectedAvatar
        })
    }

    public validateEmail(){
        this.isValidatedEmail = true
    }

    public async changePassword(newPassword: string){
        this.password = newPassword
        await this.encryptPassword()
    }

    public static async getInstanceByUserId(userId: number){
        const userDAO = new UserDAO()
        const user = await userDAO.getUserById(userId)
        if(user === false){
            throw new Error(`Não foi possível recuperar o usuário pelo ID: ${userId}`)
        }
        return new this(user)
    }

    private async encryptPassword(){
        const encrypter = new UserPasswordEncrypter()
        this.password = await encrypter.encryptPassword(this.password)
    }

    private isCreated(){
        return this.userId !== undefined
    }
}