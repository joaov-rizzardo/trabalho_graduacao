import { Request, Response } from "express";
import { default500Response } from "../Utils/DefaultResponses";
import { ManagementLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import EarningDAO from "../DAO/EarningDAO";
import SpendingDAO from "../DAO/SpendingDAO";

export default async function getTransactionsFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const [earnings, spendings] = await Promise.all([
            getEarningsByPeriod({
                userId: userId,
                startDate: req.body.startDate,
                finishDate: req.body.finishDate
            }),
            getSpendingsByPeriod({
                userId: userId,
                startDate: req.body.startDate,
                finishDate: req.body.finishDate
            })
        ])
        return res.status(200).send({
            earnings, spendings
        })
    }catch(error: any){
        generateErrorLogFromRequest(ManagementLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

type getTransactionsType = {
    userId: number
    startDate?: string
    finishDate?: string
}

export async function getEarningsByPeriod({userId, startDate, finishDate}: getTransactionsType){
    const earningDAO = new EarningDAO()
    const earnings = await earningDAO.findByFilters({userId, startDate, finishDate})
    return earnings.map(earning => {
        return {
            value: earning.value,
            category: earning.category,
            date: earning.earnedAt
        }
    })
}

export async function getSpendingsByPeriod({userId, startDate, finishDate}: getTransactionsType){
    const spendingDAO = new SpendingDAO()
    const spendings = await spendingDAO.getAllSpendingsByFilters({userId, startDate, finishDate})
    return spendings
}