import bcrypt from 'bcrypt'

export default class UserPasswordEncrypter {
    private saltsRounds: number

    constructor(){
        if(process.env.ENCRYPT_SALT_ROUNDS !== undefined){
            this.saltsRounds = parseInt(process.env.ENCRYPT_SALT_ROUNDS)
        }else{
            this.saltsRounds = 10
        }
    }

    async encryptPassword(password: string){
        const salt = await bcrypt.genSalt(this.saltsRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    }

    async checkPassword(password: string, hashedPassword: string){
        return await bcrypt.compare(password, hashedPassword)
    }
}