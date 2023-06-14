import { formatMessageAndStackTrace } from '../Utils/StackTrace';
import { DatabaseLogger } from './../Utils/Logger';
import { createPool, Pool, PoolConnection } from 'mysql2/promise'

let pool: Pool | null = null;
let connection: PoolConnection | null = null
let inTransaction: boolean = false

export async function startTransaction(){
    if(connection === null){
        connection = await getConnectionFromPool()
    }
    await connection.beginTransaction()
    inTransaction = true
}

export async function commitTransaction(){
    if(connection === null){
        connection = await getConnectionFromPool()
    }
    await connection.commit()
    connection.release()
    inTransaction = false
}

export async function rollbackTransaction(){
    if(connection === null){
        connection = await getConnectionFromPool()
    }
    await connection.rollback()
    connection.release()
    inTransaction = false
}


export async function query(sql: string, params?: any[]){
    const currentStackTrace = new Error().stack
    try{
        if(connection === null){
            connection = await getConnectionFromPool()
        }
        const result = await connection.query(sql, params)
        if(connection !== null && inTransaction === false){
            connection.release()
        }
        return result
    }catch(error: any){
        DatabaseLogger.error(formatMessageAndStackTrace(error.message, currentStackTrace))
        throw new Error(error)
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

async function getConnectionFromPool(): Promise<PoolConnection> {
    if (!pool) {
      pool = createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 10,
      });
    }
    return await pool.getConnection();
  }
