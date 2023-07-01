import { NextFunction, Request, Response } from "express";
import JWTAuthenticator from "../Models/JWTAuthenticator";
import { tokenType } from "../Controllers/SignInController";
import { default401Response } from "../Utils/DefaultResponses";

declare global {
    namespace Express {
        interface Request {
            authenticatedUser?: tokenType
        }
    }
}

export default function tokenAuthenticationMiddleware(req: Request, res: Response, next: NextFunction){
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')
        if(token === undefined){
            throw new Error('Token não informado')
        }
        const jwtAuthenticator = new JWTAuthenticator()
        const decodedToken = jwtAuthenticator.decodeToken(token)
        if(decodedToken === false || typeof decodedToken === 'string'){
            throw new Error('Token inválido')
        }
        if(!validateTokenAttributes(decodedToken)){
            throw new Error('O token não possuí os atributos necessários')
        }
        req.authenticatedUser = {
            userId: decodedToken.userId,
            username: decodedToken.username,
            email: decodedToken.email,
            name: decodedToken.name,
            lastName: decodedToken.lastName,
            selectedAvatar: decodedToken.selectedAvatar,
            createdAt: decodedToken.createdAt
        }
        next()
    }catch(error: any){
        return res.status(401).send(default401Response())
    } 
}

export function validateTokenAttributes(token: Record<string, any>){
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
