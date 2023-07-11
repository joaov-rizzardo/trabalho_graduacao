import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import { ProfileLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import UserLevel from "../Models/UserLevel";

export default async function getUserLevelFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const userLevel = await UserLevel.getInstanceByUserId(userId)
        return res.status(200).send(userLevel.convertToObject())
    }catch(error: any){
        generateErrorLogFromRequest(ProfileLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}