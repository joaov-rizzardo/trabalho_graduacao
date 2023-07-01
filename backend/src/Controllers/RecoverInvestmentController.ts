import { Request, Response } from "express";
import { default403Response, default500Response } from "../Utils/DefaultResponses";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";
import Goal from "../Models/Goal";
import UserFinance from "../Models/UserFinance";
import Activity from "../Models/Activity";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import getCurrentStringDatetime from "../Utils/DateUtils";

export default async function recoverInvestmentFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        await startTransaction()
        const goal = await recoverInvestment(req.body.goalId, req.body.value)
        if(goal.getUserId !== userId){
            await rollbackTransaction()
            return res.status(403).send(default403Response())
        }
        const [userFinance] = await Promise.all([
            incrementUserBalanceByRecoveredInvestment(goal, req.body.value),
            createActivityForRecoveredInvestment(goal, req.body.value)
        ])
        await commitTransaction()
        return res.status(200).send({
            message: 'The investment has been recovered',
            goal: goal.convertToObject(),
            userFinance: userFinance.convertToObject()
        })
    }catch(error: any){
        await rollbackTransaction()
        return res.status(500).send(default500Response())
    }
}

export async function recoverInvestment(goalId: number, value: number){
    const goal = await Goal.getInstanceById(goalId)
    goal.decrementProgress(value)
    await goal.save()
    return goal
}

export async function incrementUserBalanceByRecoveredInvestment(goal: Goal, recoveredValue: number){
    const userFinance = await UserFinance.getInstanceByUserId(goal.getUserId)
    userFinance.incrementBalance(recoveredValue)
    await userFinance.save()
    return userFinance
}

export async function createActivityForRecoveredInvestment(goal: Goal, recoveredValue: number){
    const activity = new Activity({
        userId: goal.getUserId,
        description: `Investimento recuperado no valor de ${formatNumberToCurrency(goal.getValue)}.`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}