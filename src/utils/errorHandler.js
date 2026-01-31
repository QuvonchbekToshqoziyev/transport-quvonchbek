import { BadRequestError, NotFoundError, InternalServerError, ConflictError, ForbiddenError, UnauthorizedError, ValidationError } from "./errors.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsPath = path.join(__dirname, "../../logs/logs.txt");

const logServerError = (err, req) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${req.method} ${req.originalUrl} - Status: ${err.status || 500} - Message: ${err.message}\nStack: ${err.stack}\n\n`;
    fs.appendFileSync(logsPath, logEntry);
};

const errorHandler = (err, req, res, next) => {
    if (err instanceof BadRequestError || 
        err instanceof NotFoundError || 
        err instanceof InternalServerError || 
        err instanceof ConflictError || 
        err instanceof ForbiddenError || 
        err instanceof UnauthorizedError ||
        err instanceof ValidationError) {
        
        if (err.status >= 500) {
            logServerError(err, req);
        }
        
        return res.status(err.status).json({
            status: err.status,
            message: err.message
        });
    }

    logServerError(err, req);
    return res.status(500).json({
        status: 500,
        message: "Internal Server Error"
    });
};

export default errorHandler;
