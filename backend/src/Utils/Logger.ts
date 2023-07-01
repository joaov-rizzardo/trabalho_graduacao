import { Request } from "express"
import winston from "winston"

export const AuthenticationLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/authentication.log`,
            level: 'error'
        })
    ]
})

export const BillLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/bill.log`,
            level: 'error'
        })
    ]
})

export const GoalLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/goal.log`,
            level: 'error'
        })
    ]
})

export const ManagementLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/management.log`,
            level: 'error'
        })
    ]
})

export const ProfileLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/profile.log`,
            level: 'error'
        })
    ]
})

export const TransactionLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/transaction.log`,
            level: 'error'
        })
    ]
})

export const HTTPLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/http.log`,
            level: 'info'
        })
    ]
})

export const DatabaseLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/database.log`,
            level: 'error'
        })
    ]
})

export function generateErrorLogFromRequest(logger: winston.Logger, req: Request, errorMessage: string){
    const fullMessage = `${req.url} - ${errorMessage}`
    logger.error(fullMessage)
}

function getLoggerFormat(){
    return winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        winston.format.printf((info) => `[${info.timestamp}] ${info.message}`)
    )
}



