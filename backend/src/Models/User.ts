export type UserType = {
    id: number,
    username: string,
    password: string,
    email: string,
    name: string,
    lastName: string,
    selectedAvatar: number,
    createdAt: string
}

export default class User {
    private id: number
    private username: string
    private password: string
    private email: string
    private name: string
    private lastName: string
    private selectedAvatar: number
    private createdAt: string

    constructor(instanceParams: UserType){
        this.id = instanceParams.id
        this.username = instanceParams.username
        this.password = instanceParams.password
        this.email = instanceParams.email
        this.name = instanceParams.name
        this.lastName = instanceParams.lastName
        this.selectedAvatar = instanceParams.selectedAvatar
        this.createdAt = instanceParams.createdAt
    }
}