import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import { ProfileLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import UserFinance from "../Models/UserFinance";

export default async function getUserFinanceFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const userFinance = await UserFinance.getInstanceByUserId(userId)
        return res.status(200).send(userFinance.convertToObject())
    }catch(error: any){
        generateErrorLogFromRequest(ProfileLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}