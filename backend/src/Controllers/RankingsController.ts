import { Request, Response } from "express";
import { ManagementLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { default500Response } from "../Utils/DefaultResponses";
import PointsRanking from "../Models/PointsRanking";
import LevelRanking from "../Models/LevelRanking";

export async function getPointsRankingFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const ranking = await PointsRanking.getInstanceWithRankings()
        return res.status(200).send({
            topRanking: ranking.getTopRanking(),
            userRanking: ranking.getUserRanking(userId)
        })
    }catch(error: any){
        generateErrorLogFromRequest(ManagementLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function getLevelRankingFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const ranking = await LevelRanking.getInstanceWithRankings()
        return res.status(200).send({
            topRanking: ranking.getTopRanking(),
            userRanking: ranking.getUserRanking(userId)
        })
    }catch(error: any){
        generateErrorLogFromRequest(ManagementLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}