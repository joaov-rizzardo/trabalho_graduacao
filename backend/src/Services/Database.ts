import { formatMessageAndStackTrace } from '../Utils/StackTrace';
import { DatabaseLogger } from './../Utils/Logger';
import { createPool, PoolConnection } from 'mysql2/promise'
export async function startTransaction(){
    await query('START TRANSACTION')
}

export async function commitTransaction(){
    await query('COMMIT')
}

export async function rollbackTransaction(){
    await query('ROLLBACK')
}

export async function query(sql: string, params?: any[]){
    const currentStackTrace = new Error().stack
    try{
        const connection = await getDatabaseConnection()
        return await connection.query(sql, params)
    }catch(error: any){
        DatabaseLogger.error(formatMessageAndStackTrace(error.message, currentStackTrace))
        return false
    }
}



export type ResultSetHeaderType = {
    fieldCount: number,
    affectedRows: number,
    insertId: number,
    info: string,
    serverStatus: number,
    warningStatus: number
}

async function getDatabaseConnection(): Promise<PoolConnection> {
    const pool = createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 10
    })
    return await pool.getConnection()
}
