import { verify } from 'jsonwebtoken';
import {sign} from 'jsonwebtoken'

export default class JWTAuthenticator {
    private secretKey: string;
    
    constructor(){
        this.secretKey = process.env.JWT_SECRET_KEY!
    }

    public generateToken(data: object){
        return sign(data, this.secretKey)
    }

    public decodeToken(token: string){
        try {
            return verify(token, this.secretKey)
        }catch(error: any){
            return false
        }
    }

    public checkToken(token: string){
        try {
            verify(token, this.secretKey)
            return true
        }catch(error){
            return false
        }
    }

    public validateTokenAttributes(token: Record<string, any>){
        const expectedProperties = [
            {name: 'userId', type: 'number'},
            {name: 'username', type: 'string'},
            {name: 'email', type: 'string'},
            {name: 'name', type: 'string'},
            {name: 'lastName', type: 'string'},
            {name: 'selectedAvatar', type: 'number'},
            {name: 'createdAt', type: 'string'},
        ]
        let isValidToken = true
        expectedProperties.forEach(({name, type}) => {
            if(!(name in token) || typeof token[name] !== type){
                isValidToken = false
            }
        })
        return isValidToken
    }
}