import winston from "winston"

export default winston.createLogger({
    levels: getLoggerLevels(),
    format: getLoggerFormat(),
    transports: getLoggerTransports()
})

function getLoggerFormat(){
    return winston.format.combine(
        winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
        winston.format.printf((info) => `[${info.timestamp}] ${info.message}`)
    )
}

function getLoggerTransports(){
    const logsDir = 'logs/'
    return [
        new winston.transports.Console({level: 'error'}),
        new winston.transports.File({filename: `${logsDir}error.log`, level: "error"}),
        new winston.transports.File({filename: `${logsDir}warning.log`, level: "warning"}),
        new winston.transports.File({filename: `${logsDir}info.log`, level: "info"}),
        new winston.transports.File({filename: `${logsDir}http.log`,level: "http"}),
        new winston.transports.File({filename: `${logsDir}debug.log`, level: "debug"})
    ]
}

function getLoggerLevels(){
    return {
        error: 0,
        warning: 1,
        info: 2,
        http: 3,
        debug: 4
    }
}

