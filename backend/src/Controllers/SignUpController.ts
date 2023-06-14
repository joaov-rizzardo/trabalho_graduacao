import {Request, Response} from 'express'
import { ErrorLogger } from '../Utils/Logger'
import UserDAO from '../DAO/UserDAO'
import { default201Response, default400Response, default500Response } from '../Utils/DefaultResponses'
import getCurrentStringDatetime from '../Utils/DateUtils'
import User from '../Models/User'
import { commitTransaction, rollbackTransaction, startTransaction } from '../Services/Database'
import UserFinance from '../Models/UserFinance'
import UserLevel from '../Models/UserLevel'
import UserAvatars from '../Models/UserAvatars'

const userDAO = new UserDAO()

type createUserType = {
    username: string,
    password: string,
    email: string,
    name: string,
    lastName: string,
}

export default async function signUpFlow(req: Request, res: Response){
    try {
        const body = req.body
        await startTransaction()
        const availabilityErrors = await checkUserAvailability({
            username: body.username,
            email: body.email
        })
        if(availabilityErrors.length > 0){
            return res.status(400).send(default400Response(availabilityErrors))
        }
        const user = await createUser({
            username: body.username,
            password: body.password,
            email: body.email,
            name: body.name,
            lastName: body.lastName
        })
        const userId = user.getId
        if(userId === undefined){
            throw new Error('Não foi possível recuperar o id do usuário inserido')
        }
        await Promise.all([
            createUserFinancesByUserId(userId),
            createUserLevelByUserId(userId),
            reclaimInnitialsAvatarsToUser(userId)
        ])
        await commitTransaction()
        return res.status(201).send(default201Response('The user has been created'))
    }catch(error: any){
        await rollbackTransaction()
        ErrorLogger.error(error.message)
        return res.status(500).send(default500Response())
    }
}

async function createUser(params: createUserType): Promise<User>{
    const user = new User({
        username: params.username,
        password: params.password,
        email: params.email,
        name: params.name,
        lastName: params.lastName,
        selectedAvatar: 0,
        isValidatedEmail: false,
        createdAt: getCurrentStringDatetime()
    })
    await user.save()
    return user
}

async function createUserFinancesByUserId(userId: number){
    const userFinance = new UserFinance({
        userId: userId,
        balance: 0,
        totalSavings: 0,
        currentSavings: 0
    })
    await userFinance.save()
    return userFinance
}

async function createUserLevelByUserId(userId: number){
    const userLevel = new UserLevel({
        userId: userId,
        currentLevel: 1,
        currentXp: 0,
        points: 0
    })
    await userLevel.save()
    return userLevel
}

async function reclaimInnitialsAvatarsToUser(userId: number){
    const userAvatars = await UserAvatars.getInstanceByUserId(userId)
    const innitialAvatarsQuantity = 5
    for(let i = 0; i < innitialAvatarsQuantity; i++){
        await userAvatars.addRandomAvatarToUser()
    }
    return userAvatars
}

async function checkUserAvailability({username, email}: {username: string, email: string}){
    const errors = []
    if(await isAvailableUsername(username) === false){
        errors.push('The username is not available')
    }
    if(await isAvailableEmail(email) === false){
        errors.push('The email is not available')
    }
    return errors
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
