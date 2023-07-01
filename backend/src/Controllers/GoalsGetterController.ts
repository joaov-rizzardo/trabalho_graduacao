import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import UserGoals from "../Models/UserGoals";
import { GoalLogger, generateErrorLogFromRequest } from "../Utils/Logger";

export default async function getGoalsFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try {
        const userGoals = await getUserGoalsById(userId)
        const goals = userGoals.convertToObject().goals
        return res.status(200).send(goals)
    }catch(error: any){
        generateErrorLogFromRequest(GoalLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function getUserGoalsById(userId: number){
    const userGoals = await UserGoals.instanceWithAllUserGoals(userId)
    return userGoals
}