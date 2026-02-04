import dotenv from "dotenv";
import pool from "../database/config.js";
import { verifyAccessToken } from "../utils/jwt.js";

dotenv.config({ quiet: true });

export const checkToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        return res.sendStatus(401);
    }
    
    try {
        const decoded = verifyAccessToken(token);
        
        if (decoded.keyword !== process.env.JWT_KEYWORD) {
            return res.status(403).json({ 
                status: 403, 
                message: "Invalid token keyword" 
            });
        }

        if (decoded.id === 'superadmin') {
            req.user = {
                id: 'superadmin',
                username: decoded.username,
                email: process.env.SUPERADMIN_EMAIL,
                role: 'superadmin',
                branch: null,
                ip: decoded.ip,
                userAgent: decoded.userAgent
            };
            return next();
        }

        const result = await pool.query(
            "SELECT id, branch, username, email, role FROM staffs WHERE id = $1",
            [decoded.id]
        );
        
        if (!result.rows[0]) {
            return res.status(401).json({ 
                status: 401, 
                message: "User not found" 
            });
        }

        req.user = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            email: result.rows[0].email,
            role: result.rows[0].role,
            branch: result.rows[0].branch,
            ip: decoded.ip,
            userAgent: decoded.userAgent
        };
        
        next();
    } catch (error) {
        return res.sendStatus(403);
    }
};

export default checkToken;
