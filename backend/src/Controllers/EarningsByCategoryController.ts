import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import { ManagementLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import EarningDAO from "../DAO/EarningDAO";
import { EarningCategoryEnum } from "../Enums/EarningCategoryEnum";

export default async function getEarningsByCategoryFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const earningByCategoryData = await getEarningsByCategory({
            userId: userId,
            startDate: req.body.startDate,
            finishDate: req.body.finishDate
        })
        return res.status(200).send(earningByCategoryData.map(earning => {
            return {
                value: earning.value,
                categoryKey: earning.category,
                categoryDescription: EarningCategoryEnum[earning.category]
            }
        }))
    }catch(error: any){
        generateErrorLogFromRequest(ManagementLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

type getEarningsByCategoryType = {
    userId: number
    startDate?: string
    finishDate?: string
}
export async function getEarningsByCategory({userId, startDate, finishDate}: getEarningsByCategoryType){
    const earningDAO = new EarningDAO()
    const earningByCategoryData = await earningDAO.getEarningsByCategory({userId, startDate, finishDate})
    return earningByCategoryData
}