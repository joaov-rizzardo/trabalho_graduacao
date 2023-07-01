import { Request, Response } from "express";
import { default400Response, default500Response } from "../Utils/DefaultResponses";
import Earning from "../Models/Earning";
import { EarningCategoryEnum } from "../Enums/EarningCategoryEnum";
import getCurrentStringDatetime from "../Utils/DateUtils";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";
import UserFinance from "../Models/UserFinance";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import Activity from "../Models/Activity";
import UserLevel from "../Models/UserLevel";

export default async function createEarningFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        await startTransaction()
        if(!(req.body.categoryKey in EarningCategoryEnum)){
            await rollbackTransaction()
            return res.status(400).send(default400Response(['The categoryKey field is invalid']))
        }
        const earning = await createEarning({
            userId: userId,
            description: req.body.description,
            value: req.body.value,
            categoryKey: req.body.categoryKey
        })
        const {xp, points} = await earning.reclaimRewards()
        const [userFinance, userLevel] = await Promise.all([
            incrementUserFinanceByEarning(earning),
            insertXpAndPointsByEarning(earning, {xp, points}),
            createActivityByEarning(earning)
        ])
        await commitTransaction()
        return res.status(201).send({
            message: 'The earning has been created',
            spending: earning.convertToObject(),
            userFinance: userFinance.convertToObject(),
            userLevel: userLevel.convertToObject(),
            rewards: {xp, points}
        })
    }catch(error: any){
        await rollbackTransaction()
        return res.status(500).send(default500Response())
    }
}

type createEarningType = {
    userId: number
    description: string
    value: number
    categoryKey: keyof typeof EarningCategoryEnum
}

export async function createEarning(params: createEarningType){
    const earning = new Earning({
        userId: params.userId,
        description: params.description,
        value: params.value,
        categoryKey: params.categoryKey,
        earnedAt: getCurrentStringDatetime(),
        isCanceled: false
    })
    await earning.save()
    return earning
}

export async function incrementUserFinanceByEarning(earning: Earning){
    const userFinance = await UserFinance.getInstanceByUserId(earning.getUserId)
    userFinance.incrementBalance(earning.getValue)
    await userFinance.save()
    return userFinance
}

export async function createActivityByEarning(earning: Earning){
    const activity = new Activity({
        userId: earning.getUserId,
        description: `Novo ganho incluído no valor de ${formatNumberToCurrency(earning.getValue)}`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}

export async function insertXpAndPointsByEarning(earning: Earning, {xp, points}: {xp: number, points: number}){
    const userLevel = await UserLevel.getInstanceByUserId(earning.getUserId)
    userLevel.incrementPoints(points)
    userLevel.incrementXp(xp)
    await userLevel.save()
    return userLevel
}