import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";
import Goal from "../Models/Goal";
import getCurrentStringDatetime from "../Utils/DateUtils";
import Activity from "../Models/Activity";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import { GoalLogger, generateErrorLogFromRequest } from "../Utils/Logger";

export default async function createGoalFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        await startTransaction()
        const goal = await createGoal({
            userId: userId,
            description: req.body.description,
            value: req.body.value
        })
        await createActivityByGoal(goal)
        await commitTransaction()
        return res.status(201).send({
            message: 'The goal has been created',
            goal: goal.convertToObject()
        })
    }catch(error: any){
        await rollbackTransaction()
        generateErrorLogFromRequest(GoalLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

type CreateGoalType = {
    userId: number,
    description: string,
    value: number
}

export async function createGoal({userId, description, value}: CreateGoalType){
    const goal = new Goal({
        userId: userId,
        description: description,
        value: value,
        progressValue: 0,
        createdAt: getCurrentStringDatetime(),
        isCanceled: false,
        isCompleted: false,
    })
    await goal.save()
    return goal
}

export async function createActivityByGoal(goal: Goal){
    const activity = new Activity({
        userId: goal.getUserId,
        description: `Nova meta cadastrada no valor de ${formatNumberToCurrency(goal.getValue)}`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}