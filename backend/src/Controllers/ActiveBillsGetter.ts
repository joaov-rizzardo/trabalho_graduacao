import { Request, Response } from "express";
import { BillLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { default500Response } from "../Utils/DefaultResponses";
import BillDAO from "../DAO/BillDAO";
import Bill from "../Models/Bill";
import BillInstallment from "../Models/BillInstallment";

export default async function getActiveBillsFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        const activeBills = await findActiveBillsByUser(userId)
        return res.status(200).send(activeBills.map(bill => bill.convertToObject()))
    }catch(error: any){
        generateErrorLogFromRequest(BillLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function findActiveBillsByUser(userId: number){
    const billDAO = new BillDAO()
    const userBills = await billDAO.getNotCanceledBillsByUserId(userId)
    const bills = await Promise.all(userBills.map( async (bill) => {
        const installments = await billDAO.getInstallmentsByBillId(bill.billId);
        return new Bill({
            biilId: bill.billId,
            userId: bill.userId,
            billType: bill.typeId,
            category: bill.category,
            description: bill.description,
            installmentValue: bill.installmentValue,
            installments: installments.map(installment => new BillInstallment(installment)),
            paymentDay: bill.paymentDay,
            createdAt: bill.createdAt,
            isCanceled: bill.isCanceled,
            canceledAt: bill.canceledAt
        })
    }))
    const activeBills = bills.filter(bill => bill.isActive())
    return activeBills
}