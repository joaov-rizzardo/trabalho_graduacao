import { Request, Response } from "express";
import { TransactionLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { default500Response } from "../Utils/DefaultResponses";
import UserActivitys from "../Models/UserActivitys";

export default async function getLastAcitivities(req: Request, res: Response){
    try{
        const userId = req.authenticatedUser!.userId
        const userActivities = await UserActivitys.getInstanceWithLastThirdyActivitys(userId)
        return res.status(200).send(userActivities.convertToObject().activitys)
    }catch(error: any){
        generateErrorLogFromRequest(TransactionLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}