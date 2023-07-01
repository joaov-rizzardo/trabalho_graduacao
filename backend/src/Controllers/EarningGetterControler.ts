import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import EarningDAO from "../DAO/EarningDAO";
import Earning from "../Models/Earning";

export default async function getEarningsFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const earnings = await getEarningsByFilters({
            userId: userId,
            startDate: req.body.startDate !== undefined ? req.body.startDate.concat(' 00:00:00') : undefined,
            finishDate: req.body.finishDate !== undefined ? req.body.finishDate.concat(' 23:59:59') : undefined,
        })
        return res.status(200).send(earnings.map(earning => earning.convertToObject()))
    }catch(error: any){
        return res.status(500).send(default500Response())
    }
}

type GetEarningByFiltersType = {
    userId: number,
    startDate?: string,
    finishDate?: string
}

export async function getEarningsByFilters({userId, startDate, finishDate}: GetEarningByFiltersType){
    const earningDAO = new EarningDAO()
    const earningData = await earningDAO.findByFilters({userId, startDate, finishDate})
    return earningData.map(earning => new Earning({
        earningId: earning.earningId,
        categoryKey: earning.category,
        earnedAt: earning.earnedAt,
        userId: earning.userId,
        description: earning.description,
        value: earning.value,
        isCanceled: earning.isCanceled,
        canceledAt: earning.canceledAt
    }))
}
