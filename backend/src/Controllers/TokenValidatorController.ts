import {Request, Response} from 'express'
import { ErrorLogger } from '../Utils/Logger'
import { default500Response } from '../Utils/DefaultResponses'
import JWTAuthenticator from '../Models/JWTAuthenticator'

export default function checkTokenFlow(req: Request, res: Response){
    try{
        const token: string = req.body.token
        if(checkToken(token) === true){
            return res.status(200).send({isValid: true})
        }else{
            return res.status(200).send({isValid: false})
        }
    }catch(error: any){
        ErrorLogger.error(error.message)
        return res.status(500).send(default500Response())
    }
}

export function checkToken(token: string){
    const jwt = new JWTAuthenticator()
    return jwt.checkToken(token)
}

