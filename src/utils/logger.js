import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/error.txt", level: "error" })
    ]
});

export default logger;
