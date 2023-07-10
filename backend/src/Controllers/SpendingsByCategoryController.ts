import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import { ManagementLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import SpendingDAO from "../DAO/SpendingDAO";
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";

export default async function getSpendingsByCategoryFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const spendingByCategoryData = await getSpendingsByCategory({
            userId: userId,
            startDate: req.body.startDate,
            finishDate: req.body.finishDate
        })
        return res.status(200).send(spendingByCategoryData.map(spending => {
            return {
                value: spending.value,
                categoryKey: spending.category,
                categoryDescription: SpendingCategoryEnum[spending.category]
            }
        }))
    }catch(error: any){
        generateErrorLogFromRequest(ManagementLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}
type getSpendingsByCategoryType = {
    userId: number
    startDate?: string
    finishDate?: string
}

export async function getSpendingsByCategory({userId, startDate, finishDate}: getSpendingsByCategoryType){
    const spendingDAO = new SpendingDAO()
    const spendingByCategoryData = await spendingDAO.getSpendingsByCategory({userId, startDate, finishDate})
    return spendingByCategoryData
}