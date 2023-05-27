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
import AvatarDAO from '../DAO/AvatarDAO'

const userDAO = new UserDAO()
const errors: string[] = []

type createUserType = {
    username: string,
    password: string,
    email: string,
    name: string,
    lastName: string,
}

export default async function signUp(req: Request, res: Response){
    try {
        const body = req.body
        const userId = await createNewUser({
            username: body.username,
            password: body.password,
            email: body.email,
            name: body.name,
            lastName: body.lastName
        })
        if(userId === false){
            if(hasErrors()){
                return res.status(400).send(default400Response(errors))
            }else {
                throw new Error("Usuário não foi criado, e nenhum erro de validação foi obtido")
            }
        }else{
            return res.status(201).send(default201Response('The user has been created'))
        }
    }catch(error: any){
        ErrorLogger.error(error.message)
        res.status(500).send(default500Response())
    }
}

export async function createNewUser(params: createUserType): Promise<false|number>{
    try {
        if(!checkUserAvailability({...params})){
            return false
        }
        await startTransaction()
        const userId = await createUserAndReturnId({...params})
        await Promise.all([
            createUserFinances(userId),
            createUserLevel(userId),
            reclaimInnitialsAvatarsToUser(userId)
        ])
        await commitTransaction()
        return userId
    }catch(error: any){
        await rollbackTransaction()
        throw new Error(error)
    }
}

async function createUserAndReturnId(params: createUserType): Promise<number>{
    const user = new User({
        username: params.username,
        password: params.password,
        email: params.email,
        name: params.name,
        lastName: params.lastName,
        selectedAvatar: 0,
        createdAt: getCurrentStringDatetime()
    })
    await user.save()
    const userId = user.getId
    if(userId === undefined){
        throw new Error("Não foi possível recuperar o id do usuário inserido")
    }
    return userId
}

async function createUserFinances(userId: number){
    const userFinance = new UserFinance({
        userId: userId,
        balance: 0,
        totalSavings: 0,
        currentSavings: 0
    })
    await userFinance.save()
}

async function createUserLevel(userId: number){
    const userLevel = new UserLevel({
        userId: userId,
        currentLevel: 0,
        currentXp: 0,
        points: 0
    })
    await userLevel.save()
}

async function reclaimInnitialsAvatarsToUser(userId: number){
    const userAvatars = await UserAvatars.getInstanceByUserId(userId)
    const innitialAvatarsQuantity = 5
    for(let i = 0; i < innitialAvatarsQuantity; i++){
        await userAvatars.addRandomAvatarToUser()
    }
}

async function checkUserAvailability(params: createUserType){
    if(! await isAvailableUsername(params.username)){
        errors.push('The username is not available')
    }
    if(! await isAvailableEmail(params.email)){
        errors.push('The email is not available')
    }
    if(hasErrors()){
        return false
    }
    return true
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