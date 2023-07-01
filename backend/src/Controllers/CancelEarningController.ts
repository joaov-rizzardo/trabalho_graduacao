import { Request, Response } from "express";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";
import { default403Response, default500Response } from "../Utils/DefaultResponses";
import Earning from "../Models/Earning";
import UserFinance from "../Models/UserFinance";
import Activity from "../Models/Activity";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import getCurrentStringDatetime from "../Utils/DateUtils";

export default async function cancelEarningFlow(req: Request, res: Response){
    const earningId = parseInt(req.params.earningId)
    const userId = req.authenticatedUser!.userId
    try{
        await startTransaction()
        const earning = await cancelEarningById(earningId)
        if(earning.getUserId !== userId){
            await rollbackTransaction()
            return res.status(403).send(default403Response())
        }
        const [userFinance] = await Promise.all([
            decrementUserFinanceByCanceledEarning(earning),
            createActivityByCanceledEarning(earning)
        ])
        await commitTransaction()
        return res.status(200).send({
            message: `The earning ${earningId} has been canceled`,
            userFinance: userFinance.convertToObject()
        })
    }catch(error: any){
        await rollbackTransaction()
        return res.status(500).send(default500Response())
    }
}

export async function cancelEarningById(earningId: number){
    const earning = await Earning.getInstanceById(earningId)
    earning.cancelEarning()
    await earning.save()
    return earning
}

export async function decrementUserFinanceByCanceledEarning(earning: Earning){
    const userFinance = await UserFinance.getInstanceByUserId(earning.getUserId)
    userFinance.decrementBalance(earning.getValue)
    await userFinance.save()
    return userFinance
}

export async function createActivityByCanceledEarning(earning: Earning){
    const activity = new Activity({
        userId: earning.getUserId,
        description: `Gasto no valor de ${formatNumberToCurrency(earning.getValue)} foi cancelado`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}