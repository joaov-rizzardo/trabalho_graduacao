import { Request, Response } from "express";
import { default403Response, default500Response } from "../Utils/DefaultResponses";
import Spending from "../Models/Spending";
import UserFinance from "../Models/UserFinance";
import Activity from "../Models/Activity";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import getCurrentStringDatetime from "../Utils/DateUtils";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";

export default async function cancelSpedingFlow(req: Request, res: Response){
    const spendingId = parseInt(req.params.spendingId)
    const userId = req.authenticatedUser!.userId
    try{
        await startTransaction()
        const spending = await cancelSpendingById(spendingId)
        if(spending.getUserId !== userId){
            await rollbackTransaction()
            return res.status(403).send(default403Response())
        }
        const [userFinance] = await Promise.all([
            incrementUserFinancesByCanceledSpending(spending),
            createActivityByCanceledSpending(spending)
        ])
        await commitTransaction()
        return res.status(200).send({
            message: `The spending ${spendingId} has been canceled`,
            userFinance: userFinance.convertToObject()
        })
    }catch(error: any){
        await rollbackTransaction()
        console.log(error)
        return res.status(500).send(default500Response())
    }
}

export async function cancelSpendingById(spendingId: number){
    const spending = await Spending.getInstanceById(spendingId)
    spending.cancelSpending()
    await spending.save()
    return spending
}

export async function incrementUserFinancesByCanceledSpending(spending: Spending){
    const userId = spending.getUserId
    const userFinance = await UserFinance.getInstanceByUserId(userId)
    userFinance.incrementBalance(spending.getValue)
    await userFinance.save()
    return userFinance
}

export async function createActivityByCanceledSpending(spending: Spending){
    const userId = spending.getUserId
    const activity = new Activity({
        userId: userId,
        description: `Ganho no valor de ${formatNumberToCurrency(spending.getValue)} foi cancelado`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}