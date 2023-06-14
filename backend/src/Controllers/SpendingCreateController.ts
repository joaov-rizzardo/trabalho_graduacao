import { Request, Response } from 'express';
import { default400Response, default500Response } from '../Utils/DefaultResponses';
import Spending from '../Models/Spending';
import { SpendingCategoryEnum } from '../Enums/SpendingCategoryEnum';
import UserFinance from '../Models/UserFinance';
import { BalanceTypeEnum } from '../Enums/BalanceTypeEnum';
import Activity from '../Models/Activity';
import { formatNumberToCurrency } from '../Utils/NumberFormats';
import getCurrentStringDatetime from '../Utils/DateUtils';
import { commitTransaction, rollbackTransaction, startTransaction } from '../Services/Database';
import UserLevel from '../Models/UserLevel';

export default async function createSpendingFlow(req: Request, res: Response){
    try{
        await startTransaction()
        if(!(req.body.categoryKey in SpendingCategoryEnum)){
            await rollbackTransaction()
            return res.status(400).send(default400Response(['The categoryKey field is invalid']))
        }
        if(!(req.body.balanceType in BalanceTypeEnum)){
            await rollbackTransaction()
            return res.status(400).send(default400Response(['The balanceType field is invalid']))
        }
        const spending = await createSpeding({
            userId: parseInt(req.body.userId),
            description: req.body.description,
            value: parseFloat(req.body.value),
            categoryKey: req.body.categoryKey
        })
        const {xp, points} = await spending.reclaimRewards()
        const [userFinance, userLevel] = await Promise.all([
            decrementUserFinanceBySpending(spending, req.body.balanceType),
            insertXpAndPointsBySpending(spending, {xp, points}),
            insertUserActivityBySpending(spending)
        ])
        await commitTransaction()
        return res.status(201).send({
            message: 'The spending has been created',
            spending: spending.convertToObject(),
            userFinance: userFinance.convertToObject(),
            userLevel: userLevel.convertToObject(),
            rewards: {xp, points}
        })
    }catch(error: any){
        await rollbackTransaction()
        console.log(error)
        return res.status(500).send(default500Response())
    }
}
export type createSpendingType = {
    userId: number
    description: string
    value: number
    categoryKey: keyof typeof SpendingCategoryEnum
}

export async function createSpeding(params: createSpendingType){
    const spending = new Spending({
        userId: params.userId,
        description: params.description,
        value: params.value,
        categoryKey: params.categoryKey,
        spentAt: getCurrentStringDatetime(),
        isCanceled: false
    })
    await spending.save()
    return spending
}

export async function decrementUserFinanceBySpending(spending: Spending, balanceType: keyof typeof BalanceTypeEnum){
    const userFinance = await UserFinance.getInstanceByUserId(spending.getUserId)
    if(balanceType === "SA"){
        userFinance.decrementBalance(spending.getValue)
    }else if(balanceType === "EC"){
        userFinance.decrementCurrentSavings(spending.getValue)
    }
    await userFinance.save()
    return userFinance
}

export async function insertUserActivityBySpending(spending: Spending){
    const userActivity = new Activity({
        userId: spending.getUserId,
        description: `Novo gasto incluído no valor de ${formatNumberToCurrency(spending.getValue)}`,
        createdAt: getCurrentStringDatetime()
    })
    await userActivity.save()
    return userActivity
}

export async function insertXpAndPointsBySpending(spending: Spending, {xp, points}: {xp: number, points: number}){
    const userLevel = await UserLevel.getInstanceByUserId(spending.getUserId)
    userLevel.incrementPoints(points)
    await userLevel.incrementXp(xp)
    await userLevel.save()
    return userLevel
}