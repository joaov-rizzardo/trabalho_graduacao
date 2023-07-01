import {Request, Response} from 'express'
import UserDAO from '../DAO/UserDAO'
import User, { UserType } from '../Models/User'
import { default400Response, default500Response } from '../Utils/DefaultResponses'
import JWTAuthenticator from '../Models/JWTAuthenticator'
import { AuthenticationLogger, generateErrorLogFromRequest } from '../Utils/Logger'

export type tokenType = {
    userId: number,
    username: string,
    email: string,
    name: string,
    lastName: string,
    selectedAvatar: number,
    createdAt: string
}

export default async function signIn(req: Request, res: Response){
    try {
        const body = req.body
        const authenticatedResult = await authenticateUser(body.username, body.password)
        if(authenticatedResult.ok === false || authenticatedResult.user === false){
            return res.status(400).send(default400Response(authenticatedResult.errors))
        }
        const user: tokenType = {
            userId: authenticatedResult.user.userId!,
            username: authenticatedResult.user.username,
            email: authenticatedResult.user.email,
            name: authenticatedResult.user.name,
            lastName: authenticatedResult.user.lastName,
            selectedAvatar: authenticatedResult.user.selectedAvatar,
            createdAt: authenticatedResult.user.createdAt!
        }
        const jwt = new JWTAuthenticator()
        const token = jwt.generateToken(user)
        return res.status(200).send({
            token: token,
            user: user
        })
    }catch(error: any){
        generateErrorLogFromRequest(AuthenticationLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function authenticateUser(username: string, password: string): Promise<{ok: boolean, errors: string[], user: UserType|false}>{
    const userDAO = new UserDAO()
    const userData = await userDAO.getUserByField('username', username)
    if(userData === false){
        return {ok: false, errors: ['No user found'], user: false}
    }
    const user = new User(userData)
    if(await user.checkPassword(password) === false){
        return {ok: false, errors: ['Incorrect password'], user: false}
    }
    return {ok: true, errors: [], user: user.convertToObject()}
}