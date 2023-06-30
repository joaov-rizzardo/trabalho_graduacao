import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import Goal from "../Models/Goal";
import UserFinance from "../Models/UserFinance";
import Activity from "../Models/Activity";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import getCurrentStringDatetime from "../Utils/DateUtils";

export default async function cancelGoalFlow(req: Request, res: Response){
    const goalId = parseInt(req.params.goalId)
    try{
        const {goal, recoveredInvestments} = await cancelGoalById(goalId)
        const [userFinance] = await Promise.all([
            incrementUserBalanceByCanceledGoal(goal, recoveredInvestments),
            createActivityFromCanceledGoal(goal, recoveredInvestments)
        ])
        return res.status(200).send({
            message: 'The goal has been canceled',
            goal: goal.convertToObject(),
            userFinance: userFinance.convertToObject()
        })
    }catch(error: any){
        console.log(error)
        return res.status(500).send(default500Response())
    }
}

export async function cancelGoalById(goalId: number){
    const goal = await Goal.getInstanceById(goalId)
    const recoveredInvestments = goal.cancelAndRecoverInvestments()
    await goal.save()
    return {goal, recoveredInvestments} 
}

export async function incrementUserBalanceByCanceledGoal(goal: Goal, recoveredInvestments: number){
    const userFinance = await UserFinance.getInstanceByUserId(goal.getUserId)
    userFinance.incrementBalance(recoveredInvestments)
    await userFinance.save()
    return userFinance
}

export async function createActivityFromCanceledGoal(goal: Goal, recoveredInvestments: number){
    const activity = new Activity({
        userId: goal.getUserId,
        description: `Meta cancelada, valor de ${formatNumberToCurrency(recoveredInvestments)} foi recuperado`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}