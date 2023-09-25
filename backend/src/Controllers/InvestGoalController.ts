import { Request, Response } from "express";
import { default403Response, default500Response } from "../Utils/DefaultResponses";
import Goal from "../Models/Goal";
import UserFinance from "../Models/UserFinance";
import UserLevel from "../Models/UserLevel";
import Activity from "../Models/Activity";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import getCurrentStringDatetime from "../Utils/DateUtils";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";
import { GoalLogger, generateErrorLogFromRequest } from "../Utils/Logger";

export default async function investGoalFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        await startTransaction()
        const goal = await investGoal({
            goalId: req.body.goalId,
            value: req.body.value
        })
        if(goal.getUserId !== userId){
            await rollbackTransaction()
            return res.status(403).send(default403Response())
        }
        const [userFinance, userLevel] = await Promise.all([
            handleUserFinanceByInvestment(goal, req.body.value),
            insertXpAndPointsByGoal(goal, req.body.value),
            createActivityByInvesmentInGoal(goal, req.body.value),
            goal.goalIsCompleted() && createActivityByCompletedGoal(goal)
        ])
        await commitTransaction()
        return res.status(200).send({
            message: 'The investment has been made',
            goal: goal.convertToObject(),
            rewards: goal.goalIsCompleted() ? goal.reclaimRewards() : goal.getPartialRewards(req.body.value),
            userFinance: userFinance.convertToObject(),
            userLevel: userLevel.convertToObject()
        })
    }catch(error: any){
        await rollbackTransaction()
        generateErrorLogFromRequest(GoalLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function investGoal({goalId, value}: {goalId: number, value: number}){
    const goal = await Goal.getInstanceById(goalId)
    goal.incrementProgress(value)
    await goal.save()
    return goal
}

export async function handleUserFinanceByInvestment(goal: Goal, investmentValue: number){
    const userFinance = await UserFinance.getInstanceByUserId(goal.getUserId)
    userFinance.decrementBalance(investmentValue)
    if(goal.goalIsCompleted()){
        userFinance.incrementCurrentSavings(goal.getValue)
        userFinance.incrementTotalSavings(goal.getValue)
    }
    await userFinance.save()
    return userFinance
}

export async function insertXpAndPointsByGoal(goal: Goal, investValue: number){
    const userLevel = await UserLevel.getInstanceByUserId(goal.getUserId)
    if(goal.goalIsCompleted()){
        const {xp, points} = goal.reclaimRewards()
        userLevel.incrementXp(xp)
        userLevel.incrementPoints(points)
    }else{
        const {xp, points} = goal.getPartialRewards(investValue)
        userLevel.incrementXp(xp)
        userLevel.incrementPoints(points)
    }
    await userLevel.save()
    return userLevel
}

export async function createActivityByInvesmentInGoal(goal: Goal, investmentValue: number){
    const activity = new Activity({
        userId: goal.getUserId,
        description: `Investimento de ${formatNumberToCurrency(investmentValue)} foi realizado.`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}

export async function createActivityByCompletedGoal(goal: Goal){
    const activity = new Activity({
        userId: goal.getUserId,
        description: `Meta no valor de ${formatNumberToCurrency(goal.getValue)} foi completada.`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}
