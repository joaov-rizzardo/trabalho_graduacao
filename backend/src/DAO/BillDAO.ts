import { FieldPacket } from "mysql2/promise"
import { ResultSetHeaderType, query } from "../Services/Database"
import { BillEnum } from "../Enums/BillEnum"
import { convertDateObjectDatetimeToString } from "../Utils/DateUtils"
import { SpendingCategoryEnum } from "../Enums/SpendingCategoryEnum"

type InstallmentInsertType = {
    billId: number,
    installmentNumber: number,
    value: number,
    dueDate: string,
    isPayed: boolean,
    payedAt?: string,
    createdAt: string,
}

type InstallmentUpdateType = {
    installmentId: number,
    billId: number,
    installmentNumber: number,
    value: number,
    dueDate: string,
    isPayed: boolean,
    payedAt?: string,
    createdAt: string,
}

type InstallmentFieldsType = {
    installmentId: number,
    billId: number,
    installmentNumber: number,
    value: string,
    dueDate: Date,
    isPayed: number,
    payedAt: Date | null,
    createdAt: Date
}

type BillUpdateType = {
    billId: number,
    userId: number,
    typeId: keyof typeof BillEnum,
    category: keyof typeof SpendingCategoryEnum,
    description: string,
    installmentValue: number,
    paymentDay: number,
    createdAt: string,
    isCanceled: boolean,
    canceledAt?: string
}

type BillInsertType = {
    userId: number,
    typeId: keyof typeof BillEnum,
    category: keyof typeof SpendingCategoryEnum,
    description: string,
    installmentValue: number,
    paymentDay: number,
    createdAt: string,
    isCanceled: boolean,
    canceledAt?: string
}

type BillFieldsType = {
    billId: number,
    userId: number,
    typeId: keyof typeof BillEnum,
    category: keyof typeof SpendingCategoryEnum,
    description: string,
    installmentValue: string,
    paymentDay: number,
    createdAt: Date,
    isCanceled: number,
    canceledAt: Date | null
}

export default class BillDAO {
    public async insertInstallmentAndReturnId(params: InstallmentInsertType){
        const response = await query(`
            INSERT INTO
                BillInstallments
            SET
                billId = ?,
                installmentNumber = ?,
                value = ?,
                dueDate = ?,
                isPayed = ?,
                payedAt = ?,
                createdAt= ?
            `,
            [
                params.billId,
                params.installmentNumber,
                params.value,
                params.dueDate,
                params.isPayed,
                params.payedAt,
                params.createdAt
            ]
        ) as [ResultSetHeaderType, FieldPacket[]]
        const insertedId = response[0].insertId
        return insertedId
    }

    public async updateInstallment(params: InstallmentUpdateType){
        await query(`
            UPDATE
                BillInstallments
            SET
                billId = ?,
                installmentNumber = ?,
                value = ?,
                dueDate = ?,
                isPayed = ?,
                payedAt = ?,
                createdAt = ?
            WHERE
                installmentId = ?
            `,
            [
                params.billId,
                params.installmentNumber,
                params.value,
                params.dueDate,
                params.isPayed,
                params.payedAt,
                params.createdAt,
                params.installmentId
            ]
        )
    }

    public async updateBill(params: BillUpdateType){
        await query(`
            UPDATE
                UserBills
            SET
                userId = ?,
                typeId = ?,
                category = ?,
                description = ?,
                installmentValue = ?,
                paymentDay = ?,
                createdAt = ?,
                isCanceled = ?,
                canceledAt = ?
            WHERE
                billId = ?
            `,
            [
                params.userId,
                params.typeId,
                params.category,
                params.description,
                params.installmentValue,
                params.paymentDay,
                params.createdAt,
                params.isCanceled,
                params.canceledAt,
                params.billId
            ]
        )
    }

    public async insertBillAndReturnId(params: BillInsertType){
        const response = await query(`
            INSERT INTO
                UserBills
            SET
                userId = ?,
                typeId = ?,
                category = ?,
                description = ?,
                installmentValue = ?,
                paymentDay = ?,
                createdAt = ?,
                isCanceled = ?,
                canceledAt = ?
            `,
            [
                params.userId,
                params.typeId,
                params.category,
                params.description,
                params.installmentValue,
                params.paymentDay,
                params.createdAt,
                params.isCanceled,
                params.canceledAt
            ]
        ) as [ResultSetHeaderType, FieldPacket[]]
        const insertedId = response[0].insertId
        return insertedId
    }

    public async getInstallmentsByBillId(billId: number){
        const response = await query(`SELECT * FROM BillInstallments WHERE billId = ?`, [billId]) as [InstallmentFieldsType[], FieldPacket[]]
        const installmentData = response[0]
        return installmentData.map(installment => {
            return {
                installmentId: installment.installmentId,
                billId: installment.billId,
                installmentNumber: installment.installmentNumber,
                value: parseFloat(installment.value),
                dueDate: convertDateObjectDatetimeToString(installment.dueDate),
                isPayed: Boolean(installment.isPayed),
                payedAt: installment.payedAt !== null  ? convertDateObjectDatetimeToString(installment.payedAt) : undefined,
                createdAt: convertDateObjectDatetimeToString(installment.createdAt)  
            }
        })
    }

    public async getBillById(billId: number){
        const response = await query(`SELECT * FROM UserBills WHERE billId = ?`, [billId]) as [BillFieldsType[], FieldPacket[]]
        const billData = response[0][0]
        if(!billData){
            throw new Error(`Nenhuma conta foi encontrada para o ID: ${billId}`)
        }
        return {
            billId: billData.billId,
            userId: billData.userId,
            typeId: billData.typeId,
            category: billData.category,
            description: billData.description,
            installmentValue: parseFloat(billData.installmentValue),
            paymentDay: billData.paymentDay,
            createdAt: convertDateObjectDatetimeToString(billData.createdAt),
            isCanceled: Boolean(billData.isCanceled),
            canceledAt: billData.canceledAt !== null ? convertDateObjectDatetimeToString(billData.canceledAt) : undefined
        }
    }

    public async getInstallmentById(installmentId: number){
        const response = await query(`SELECT * FROM BillInstallments WHERE installmentId = ?`, [installmentId]) as [InstallmentFieldsType[], FieldPacket[]]
        const installmentData = response[0][0]
        if(!installmentData){
            throw new Error(`Nenhuma parcela foi encontrada para o ID: ${installmentId}`)
        }
        return {
            installmentId: installmentData.installmentId,
            billId: installmentData.billId,
            installmentNumber: installmentData.installmentNumber,
            value: parseFloat(installmentData.value),
            dueDate: convertDateObjectDatetimeToString(installmentData.dueDate),
            isPayed: Boolean(installmentData.isPayed),
            payedAt: installmentData.payedAt !== null ? convertDateObjectDatetimeToString(installmentData.payedAt) : undefined,
            createdAt: convertDateObjectDatetimeToString(installmentData.createdAt) 
        }
    }

    public async getNotCanceledBillsByUserId(userId: number){
        const response = await query(`SELECT * FROM UserBills WHERE userId = ? AND isCanceled = 0`, [userId]) as [BillFieldsType[], FieldPacket[]]
        const billData = response[0]
        return billData.map(bill => {
            return {
                billId: bill.billId,
                userId: bill.userId,
                typeId: bill.typeId,
                category: bill.category,
                description: bill.description,
                installmentValue: parseFloat(bill.installmentValue),
                paymentDay: bill.paymentDay,
                createdAt: convertDateObjectDatetimeToString(bill.createdAt),
                isCanceled: Boolean(bill.isCanceled),
                canceledAt: bill.canceledAt !== null ? convertDateObjectDatetimeToString(bill.canceledAt) : undefined
            }
        })
    }
}