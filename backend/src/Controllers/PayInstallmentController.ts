import { Request, Response } from "express";
import { default403Response, default500Response } from "../Utils/DefaultResponses";
import { BillLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";
import BillInstallment from "../Models/BillInstallment";
import Bill from "../Models/Bill";
import { BalanceTypeEnum } from "../Enums/BalanceTypeEnum";
import UserFinance from "../Models/UserFinance";
import Activity from "../Models/Activity";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import getCurrentStringDatetime from "../Utils/DateUtils";

export default async function payInstallmentFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        await startTransaction()
        const installment = await payInstallment(req.body.installmentKey, req.body.paidValue)
        const bill = await Bill.getInstanceById(installment.getBillId)
        if(bill.getUserId !== userId){
            await rollbackTransaction()
            return res.status(403).send(default403Response())
        }
        const [userFinance] = await Promise.all([
            decrementUserFinancesByPaidInstallment({
                userId: userId,
                paidValue: req.body.paidValue,
                balanceType: req.body.balanceType
            }),
            createActivityByPaidInstallment({
                userId: userId,
                paidValue: req.body.paidValue,
                billDescription: bill.getDescription
            })
        ])
        await commitTransaction()
        return res.status(200).send({
            message: 'The installmente has been paid',
            installment: installment.convertToObject(),
            userFinance: userFinance.convertToObject()
        })
    }catch(error: any){
        await rollbackTransaction()
        generateErrorLogFromRequest(BillLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

export async function payInstallment(installmentKey: number, paidValue: number){
    const installment = await BillInstallment.getInstanceById(installmentKey)
    installment.pay(paidValue)
    await installment.save()
    return installment
}


type decrementUserFinancesByPaidInstallmentType = {
    userId: number,
    paidValue: number,
    balanceType: keyof typeof BalanceTypeEnum
}

export async function decrementUserFinancesByPaidInstallment(params: decrementUserFinancesByPaidInstallmentType){
    const userFinance = await UserFinance.getInstanceByUserId(params.userId)
    if(params.balanceType === "EC"){
        userFinance.decrementCurrentSavings(params.paidValue)
    }else if(params.balanceType === "SA"){
        userFinance.decrementBalance(params.paidValue)
    }
    await userFinance.save()
    return userFinance
}

type createActivityByPaidInstallmentType = {
    userId: number,
    paidValue: number,
    billDescription: string
}
export async function createActivityByPaidInstallment(params: createActivityByPaidInstallmentType){
    const activity = new Activity({
        userId: params.userId,
        description: `Parcela no valor de ${formatNumberToCurrency(params.paidValue)} foi paga, referente a ${params.billDescription}`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}