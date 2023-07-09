import { Request, Response } from "express";
import { commitTransaction, rollbackTransaction, startTransaction } from "../Services/Database";
import { default500Response } from "../Utils/DefaultResponses";
import { BillLogger, generateErrorLogFromRequest } from "../Utils/Logger";
import { BillEnum } from "../Enums/BillEnum";
import Bill from "../Models/Bill";
import getCurrentStringDatetime from "../Utils/DateUtils";
import Activity from "../Models/Activity";
import { formatNumberToCurrency } from "../Utils/NumberFormats";
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum";

export default async function createBillFlow(req: Request, res: Response){
    const userId = req.authenticatedUser!.userId
    try{
        await startTransaction()
        let bill = await createBill({
            userId: userId,
            billType: req.body.billType,
            category: req.body.category,
            description: req.body.description,
            installmentValue: req.body.installmentValue,
            paymentDay: req.body.paymentDay
        })
        const installmentsQuantity = req.body.billType === "F" ? 1 : req.body.installments
        bill = await createInstallmentsForBill(bill, {
            installmentsQuantity: installmentsQuantity,
            firstDatePayment: req.body.firstDatePayment
        })
        await createActivityFromBill(bill)
        await commitTransaction()
        return res.status(201).send({
            message: 'The bill has been created',
            bill: bill.convertToObject()
        })
    }catch(error: any){
        await rollbackTransaction()
        generateErrorLogFromRequest(BillLogger, req, error.message)
        return res.status(500).send(default500Response())
    }
}

type createBillType = {
    userId: number,
    billType: keyof typeof BillEnum,
    category: keyof typeof SpendingCategoryEnum,
    description: string,
    installmentValue: number,
    paymentDay: number
}

export async function createBill(params: createBillType){
    const bill = new Bill({
        userId: params.userId,
        billType: params.billType,
        category: params.category,
        description: params.description,
        installmentValue: params.installmentValue,
        paymentDay: params.paymentDay,
        createdAt: getCurrentStringDatetime(),
        isCanceled: false
    })
    await bill.save()
    return bill
}

export async function createActivityFromBill(bill: Bill){
    const activity = new Activity({
        userId: bill.getUserId,
        description: `Nova conta cadastrada com parcelas de ${formatNumberToCurrency(bill.getInstallmentValue)}`,
        createdAt: getCurrentStringDatetime()
    })
    await activity.save()
    return activity
}

type createInstallmentsForBillType = {
    installmentsQuantity: number, 
    firstDatePayment: string
}

export async function createInstallmentsForBill(bill: Bill, {installmentsQuantity, firstDatePayment}: createInstallmentsForBillType){
    let currentDueDate = new Date(firstDatePayment)
    for(let i = 0; i < installmentsQuantity; i++){
        const dueDate = i === 0 ? firstDatePayment : generateNextDueDateFromInstallment(currentDueDate, bill.getPaymentDay)
        currentDueDate = new Date(dueDate)
        await bill.createInstallment({
            installmentNumber: i + 1,
            dueDate: dueDate
        })
    }
    return bill
}

function generateNextDueDateFromInstallment(currentDate: Date, paymentDay: number){
    let currentMonth = currentDate.getMonth() + 1
    let currentYear = currentDate.getFullYear()
    if(currentMonth === 12){
        currentMonth = 1
        currentYear += 1
    }else{
        currentMonth += 1
    }
    return `${currentYear}-${currentMonth.toString().padStart(2, "0")}-${paymentDay.toString().padStart(2, "0")}`
}