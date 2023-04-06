import { DatabaseLogger } from './../Utils/Logger';
import { createPool, PoolConnection } from 'mysql2/promise'

export async function query(sql: string, params?: any[]){
    try{
        const connection = await getDatabaseConnection()
        return await connection.execute(sql, params)
    }catch(error: any){
       // const stackTraceLimit = Error.stackTraceLimit;
        Error.stackTraceLimit = Infinity;
    
        const stackTrace = new Error().stack;
        const stackTraceArray = stackTrace?.split('\n');
    
        // remove as 2 primeiras linhas da stack trace, que são referentes ao erro e a função atual
        stackTraceArray?.shift();
        stackTraceArray?.shift();
    
        const stackTraceString = stackTraceArray?.join('\n');
    
        console.log(stackTraceString);
    
        // restaura o valor da propriedade stackTraceLimit para o padrão
       // Error.stackTraceLimit = stackTraceLimit;
        //DatabaseLogger.error(error.stack)
    }
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
