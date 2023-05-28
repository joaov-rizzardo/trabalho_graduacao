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

    public checkToken(token: string){
        try {
            verify(token, this.secretKey)
            return true
        }catch(error){
            return false
        }
    }
}