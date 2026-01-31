import authService from "../services/auth.js";
import logger from "../utils/logger.js";

class AuthController {
    async sendOTP(req, res, next) {
        try {
            logger.info(`sendOTP request received for: ${req.body.email}`);
            const result = await authService.sendOTP(req.body);
            logger.info(`sendOTP completed for: ${req.body.email}`);
            res.status(result.status).json(result);
        } catch (error) {
            logger.error(`sendOTP error: ${error.message}`);
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            const result = await authService.register(req.body);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async resendOTP(req, res, next) {
        try {
            const result = await authService.resendOTP(req.body);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'] || 'unknown';
            const result = await authService.login(req.body, ip, userAgent);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req, res, next) {
        try {
            const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'] || 'unknown';
            const result = await authService.refreshToken(req.body, ip, userAgent);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
