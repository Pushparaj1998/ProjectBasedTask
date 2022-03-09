const winston = require('winston');

const logConfiguration = {
    transports: [
        new winston.transports.File({
            filename: 'logs/binance_api-ErrorLogs.log',
            level:  "error"
        }),
        new winston.transports.File({
            filename: "logs/binance_api_Logs.log",
            level: 'info'
        })
    ],

    fromat: winston.format.combine(
        winston.format.label({
            label: `Binance_api_Service`
        }),
        winston.format.timestamp({
            format: "MMM-DD--YYYY HH:mm:SS"
        }),
        winston.format.printf(
            (data)=> `${data.level}: ${data.label}: ${[data.timestamp]}: ${data.message}`
        )


    )
}

const logger = winston.createLogger(logConfiguration, {exitOnError: false});

module.exports = logger;