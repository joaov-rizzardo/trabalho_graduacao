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
    createdAt?: string
}

export default class User {
    private userId?: number
    private username: string
    private password: string
    private email: string
    private name: string
    private lastName: string
    private selectedAvatar: number
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
            })
        }else{
            await this.encryptPassword()
            this.userId  = await this.userDAO.insertAndReturnId({
                username: this.username,
                password: this.password,
                email: this.email,
                name: this.name,
                lastName: this.lastName,
                selectedAvatar: this.selectedAvatar
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
            createdAt: this.createdAt
        }
    }

    public async checkPassword(password: string){
        const encrypter = new UserPasswordEncrypter()
        return await encrypter.checkPassword(password, this.password)
    }
    
    public async updateProfile(){
        if(this.userId === undefined){
            throw new Error('O perfil não pode ser atualizado, o usuário ainda não foi inserido no banco de dados')
        }
        await this.userDAO.updateProfile({
            userId: this.userId,
            email: this.email,
            name: this.name,
            lastName: this.lastName
        })
    }

    public static async getInstanceByUserId(userId: number){
        const userDAO = new UserDAO()
        return new this(await userDAO.getUserById(userId))
    }

    private async encryptPassword(){
        const encrypter = new UserPasswordEncrypter()
        this.password = await encrypter.encryptPassword(this.password)
    }

    private isCreated(){
        return this.userId !== undefined
    }
}