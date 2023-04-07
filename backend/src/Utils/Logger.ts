import winston from "winston"

export const ErrorLogger =  winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.Console({
            level: 'error'
        }),
        new winston.transports.File({
            filename: `logs/error.log`,
            level: 'error'
        }),
    ]
})

export const WarningLogger = winston.createLogger({
    format: getLoggerFormat(),
    transports: [
        new winston.transports.File({
            filename: `logs/warning.log`,
            level: 'warn'
        }),
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


function getLoggerFormat(){
    return winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        winston.format.printf((info) => `[${info.timestamp}] ${info.message}`)
    )
}



