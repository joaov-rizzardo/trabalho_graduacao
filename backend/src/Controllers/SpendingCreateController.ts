import { Request, Response } from 'express';
import { default400Response, default500Response } from '../Utils/DefaultResponses';
import Spending from '../Models/Spending';
import { SpendingCategoryEnum } from '../Enums/SpendingCategoryEnum';
import UserFinance from '../Models/UserFinance';
import { BalanceTypeEnum } from '../Enums/BalanceTypeEnum';

export default async function createSpendingFlow(req: Request, res: Response){
    try{
        if(!(req.body.categoryKey in SpendingCategoryEnum)){
            return res.status(400).send(default400Response(['The categoryKey field is invalid']))
        }
        if(!(req.body.balanceType in BalanceTypeEnum)){
            return res.status(400).send(default400Response(['The balanceType field is invalid']))
        }
        const spending = await createSpeding({
            userId: parseInt(req.body.userId),
            description: req.body.description,
            value: parseFloat(req.body.value),
            categoryKey: req.body.categoryKey
        })
        const userFinance = await decrementUserFinanceBySpending(spending, req.body.balanceType)
    }catch(error: any){
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