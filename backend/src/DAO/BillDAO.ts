import { FieldPacket } from "mysql2/promise"
import { ResultSetHeaderType, query } from "../Services/Database"
import { BillEnum } from "../Enums/BillEnum"

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
    value: number,
    dueDate: string,
    isPayed: boolean,
    payedAt: string,
    createdAt: string,   
}

type BillUpdateType = {
    billId: number,
    userId: number,
    typeId: keyof typeof BillEnum,
    description: string,
    value: number,
    installments: number,
    paymentDay: number,
    firstDueDate: string,
    createdAt: string,
    isCanceled: boolean,
    canceledAt?: string
}

type BillInsertType = {
    userId: number,
    typeId: keyof typeof BillEnum,
    description: string,
    value: number,
    installments: number,
    paymentDay: number,
    firstDueDate: string,
    createdAt: string,
    isCanceled: boolean,
    canceledAt?: string
}

type BillFieldsType = {
    billId: number,
    userId: number,
    typeId: keyof typeof BillEnum,
    description: string,
    value: number,
    installments: number,
    paymentDay: number,
    firstDueDate: string,
    createdAt: string,
    isCanceled: boolean,
    canceledAt: string
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
                description = ?,
                value = ?,
                installments = ?,
                paymentDay = ?,
                firstDueDate = ?,
                createdAt = ?,
                isCanceled = ?,
                canceledAt = ?
            WHERE
                billId = ?
            `,
            [
                params.userId,
                params.typeId,
                params.description,
                params.value,
                params.installments,
                params.paymentDay,
                params.firstDueDate,
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
                description = ?,
                value = ?,
                installments = ?,
                paymentDay = ?,
                firstDueDate = ?,
                createdAt = ?,
                isCanceled = ?,
                canceledAt = ?
            `,
            [
                params.userId,
                params.typeId,
                params.description,
                params.value,
                params.installments,
                params.paymentDay,
                params.firstDueDate,
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
        return installmentData
    }

    public async getBillById(billId: number){
        const response = await query(`SELECT * FROM UserBills WHERE billId = ?`, [billId]) as [BillFieldsType[], FieldPacket[]]
        const billData = response[0][0]
        if(!billData){
            throw new Error(`Nenhuma conta foi encontrada para o ID: ${billId}`)
        }
        return billData
    }

    public async getInstallmentById(installmentId: number){
        const response = await query(`SELECT * FROM BillInstallments WHERE installmentId = ?`, [installmentId]) as [InstallmentFieldsType[], FieldPacket[]]
        const installmentData = response[0][0]
        if(!installmentData){
            throw new Error(`Nenhuma parcela foi encontrada para o ID: ${installmentId}`)
        }
        return installmentData
    }
}