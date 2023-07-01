import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import Spending from "../Models/Spending";
import SpendingDAO from "../DAO/SpendingDAO";

export default async function getSpendingFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const spendings = await getSpendingsByFilters({
            userId: userId,
            startDate: req.body.startDate !== undefined ? req.body.startDate.concat(' 00:00:00') : undefined,
            finishDate: req.body.finishDate !== undefined ? req.body.finishDate.concat(' 23:59:59') : undefined,
        })
        return res.status(200).send(spendings.map(spending => spending.convertToObject()))
    }catch(error: any){
        return res.status(500).send(default500Response())
    }
}

export async function getSpendingsByFilters({userId, startDate, finishDate}: {userId: number, startDate?: string, finishDate?: string}){
    const spendingDAO = new SpendingDAO()
    const spendingsData = await spendingDAO.findByFilters({userId, startDate, finishDate})
    return spendingsData.map(spending => new Spending({
        spendingId: spending.spendingId,
        userId: spending.userId,
        description: spending.description,
        categoryKey: spending.category,
        value: spending.value,
        spentAt: spending.spentAt,
        isCanceled: spending.isCanceled,
        canceledAt: spending.canceledAt
    }))
}