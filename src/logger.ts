import * as winston from "winston";

export default winston.createLogger({
    level: process.env['NODE_ENV'] === 'development' ? 'debug' : 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});