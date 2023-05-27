import { formatMessageAndStackTrace } from '../Utils/StackTrace';
import { DatabaseLogger } from './../Utils/Logger';
import { createPool, Pool, PoolConnection } from 'mysql2/promise'

let pool: Pool | null = null;

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
    let connection = null
    try{
        connection = await getConnectionFromPool()
        return await connection.query(sql, params)
    }catch(error: any){
        DatabaseLogger.error(formatMessageAndStackTrace(error.message, currentStackTrace))
        return false
    }finally{
        if(connection !== null){
            connection.release()
        }
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
