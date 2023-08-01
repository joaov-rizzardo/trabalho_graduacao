import {Request, Response} from 'express'
import { default500Response } from '../Utils/DefaultResponses'
import JWTAuthenticator from '../Models/JWTAuthenticator'
import { AuthenticationLogger, generateErrorLogFromRequest } from '../Utils/Logger'

export default function checkTokenFlow(req: Request, res: Response){
    try{
        const token: string = req.body.token
        const decodedToken = checkToken(token)
        if(decodedToken === false){
            return res.status(200).send({isValid: false})
        }
        return res.status(200).send({
            isValid: true,
            user: decodedToken
        })
    }catch(error: any){
        generateErrorLogFromRequest(AuthenticationLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export function checkToken(token: string){
    const jwt = new JWTAuthenticator()
    if(jwt.checkToken(token) === false){
        return false
    }
    const decodedToken = jwt.decodeToken(token)
    if(decodedToken === false || typeof decodedToken === 'string'){
        return false
    }
    if(!jwt.validateTokenAttributes(decodedToken)){
        return false
    }
    return {
        userId: decodedToken.userId,
        username: decodedToken.username,
        email: decodedToken.email,
        name: decodedToken.name,
        lastName: decodedToken.lastName,
        selectedAvatar: decodedToken.selectedAvatar,
        isValidatedEmail: decodedToken.isValidatedEmail,
        createdAt: decodedToken.createdAt
    }
}

