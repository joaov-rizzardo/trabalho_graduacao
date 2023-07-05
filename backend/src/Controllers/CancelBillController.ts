import { Request, Response } from "express";
import { default403Response, default500Response } from "../Utils/DefaultResponses";
import { BillLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";
import Bill from "../Models/Bill";
import UserFinance from "../Models/UserFinance";
import Activity from "../Models/Activity";
import getCurrentStringDatetime from "../Utils/DateUtils";

export default async function cancelBillFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try {
        await startTransaction()
        const billId = parseInt(req.params.billId)
        const bill = await cancelBillById(billId)
        if(bill.getUserId !== userId){
            await rollbackTransaction()
            return res.status(403).send(default403Response())
        }
        const [userFinance] = await Promise.all([
            incrementUserBalanceByCanceledBill(bill),
            createActivityFromCanceledBill(bill)
        ])
        await commitTransaction()
        return res.status(200).send({
            message: 'The bill has been canceled',
            bill: bill.convertToObject(),
            userFinance: userFinance.convertToObject()
        })
    }catch(error: any){
        await rollbackTransaction()
        generateErrorLogFromRequest(BillLogger, req, error. message)
        return res.status(500).send(default500Response())
    }
}

export async function cancelBillById(billId: number){
    const bill = await Bill.getInstanceById(billId)
    bill.cancel()
    await bill.save()
    return bill
}

export async function incrementUserBalanceByCanceledBill(bill: Bill){
    const userFinance = await UserFinance.getInstanceByUserId(bill.getUserId)
    if(bill.getBillType === "V"){
        const installments = bill.getInstallments
        installments?.forEach(installment => {
            if(installment.isPaid){
                userFinance.incrementBalance(installment.getValue)
            }
        })
    }
    await userFinance.save()
    return userFinance
}

export async function createActivityFromCanceledBill(bill: Bill){
    const activity = new Activity({
        userId: bill.getUserId,
        description: `A conta foi descrição ${bill.getDescription} foi cancelada.`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}