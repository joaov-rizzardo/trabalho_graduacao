import {Request, Response} from 'express'
import { ErrorLogger } from '../Utils/Logger'
import UserDAO from '../DAO/UserDAO'
import { default400Response } from '../Utils/DefaultResponses'
import getCurrentStringDatetime from '../Utils/DateUtils'
import User from '../Models/User'
import { commitTransaction, rollbackTransaction, startTransaction } from '../Services/Database'

const userDAO = new UserDAO()
const errors: string[] = []

export default async function signUp(req: Request, res: Response){
    try {
        const body = req.body
        if(!isAvailableUsername(body.username)){
            errors.push('The username is not available')
        }
        if(!isAvailableEmail(body.email)){
            errors.push('The email is not available')
        }
        if(hasErrors()){
            return res.status(400).send(default400Response(errors))
        }
        await startTransaction()
        const user = new User({
            username: body.username,
            password: body.password,
            email: body.email,
            name: body.name,
            lastName: body.lastName,
            selectedAvatar: 0,
            createdAt: getCurrentStringDatetime()
        })
        await user.save()
        await commitTransaction()
    }catch(error: any){
        await rollbackTransaction()
        ErrorLogger.error(error.message)
    }
}

async function isAvailableUsername(username: string){
    const response = await userDAO.getUserByField('username', username)
    if(response === false){
        return true
    }else{
        return false
    }
}

async function isAvailableEmail(email: string){
    const response = await userDAO.getUserByField('email', email)
    if(response === false){
        return true
    }else{
        return false
    }
}

function hasErrors(){
    return errors.length !== 0
}