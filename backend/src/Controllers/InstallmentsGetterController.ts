import { Request, Response } from "express";
import { BillLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { default500Response } from "../Utils/DefaultResponses";
import BillDAO from "../DAO/BillDAO";
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";

export default async function getInstallmentsFlow(req: Request, res: Response){
    try{
        const {startDate, finishDate} = req.body
        const userId = req.authenticatedUser!.userId
        const billDao = new BillDAO()
        const installments = await billDao.getPaidBillInstallmentsByFilters({userId, startDate: `${startDate} 00:00:00`, finishDate: `${finishDate} 23:59:59`})
        return res.status(200).send(installments.map(installment => ({
            ...installment,
            categoryKey: installment.category,
            categoryDescription: SpendingCategoryEnum[installment.category]
        })))
    }catch(error: any){
        generateErrorLogFromRequest(BillLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}