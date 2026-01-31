import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import pool from "../database/config.js"
dotenv.config({ quiet: true })

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    try {
        const decoded = verifyAccessToken(token)
        
        if (decoded.keyword !== process.env.JWT_KEYWORD) {
            return res.status(403).json({ status: 403, message: "Invalid token keyword" })
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
            }
            return next()
        }

        const result = await pool.query(
            "SELECT id, branch, username, email, role FROM staffs WHERE id = $1",
            [decoded.id]
        )
        
        if (!result.rows[0]) {
            return res.status(401).json({ status: 401, message: "User not found" })
        }

        req.user = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            email: result.rows[0].email,
            role: result.rows[0].role,
            branch: result.rows[0].branch,
            ip: decoded.ip,
            userAgent: decoded.userAgent
        }
        next()
    } catch (error) {
        return res.sendStatus(403)
    }
}

export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'branchmanager' && req.user.role !== 'superadmin') {
        return res.sendStatus(403)
    }
    next()
}

export const staffMiddleware = (req, res, next) => {
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.sendStatus(403)
    }
    next()
}

export const superadminMiddleware = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.sendStatus(403)
    }
    next()
}

export const branchmanagerMiddleware = (req, res, next) => {
    if (req.user.role !== 'branchmanager' && req.user.role !== 'superadmin') {
        return res.sendStatus(403)
    }
    next()
}

export const branchAccessMiddleware = (req, res, next) => {
    if (req.user.role === 'superadmin') {
        return next()
    }

    const requestedBranch = parseInt(req.params.id || req.params.branch)
    
    if (req.user.branch !== requestedBranch) {
        return res.status(403).json({
            status: 403,
            message: "Access denied. You can only access your own branch."
        })
    }
    
    next()
}

export const permissionMiddleware = (model, action) => {
    return async (req, res, next) => {
        try {
            if (req.user.role === 'superadmin') {
                return next()
            }

            if (req.user.role !== 'admin' && req.user.role !== 'branchmanager') {
                return res.status(403).json({ 
                    status: 403, 
                    message: "Access denied. Admin privileges required." 
                })
            }

            const result = await pool.query(
                `SELECT * FROM admins 
                 WHERE staff = $1 
                 AND permission_model = $2 
                 AND $3 = ANY(permission)`,
                [req.user.id, model, action]
            )

            if (!result.rows[0]) {
                return res.status(403).json({ 
                    status: 403, 
                    message: `Access denied. You don't have '${action}' permission for '${model}'.` 
                })
            }

            next()
        } catch (error) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error checking permissions" 
            })
        }
    }
}

export const hasAnyPermission = (model) => {
    return async (req, res, next) => {
        try {
            if (req.user.role === 'superadmin') {
                return next()
            }

            const result = await pool.query(
                `SELECT * FROM admins WHERE staff = $1 AND permission_model = $2`,
                [req.user.id, model]
            )

            if (!result.rows[0]) {
                return res.status(403).json({ 
                    status: 403, 
                    message: `Access denied. No permissions for '${model}'.` 
                })
            }

            next()
        } catch (error) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error checking permissions" 
            })
        }
    }
}

export default {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    authMiddleware,
    adminMiddleware,
    staffMiddleware,
    superadminMiddleware,
    branchmanagerMiddleware,
    branchAccessMiddleware,
    permissionMiddleware,
    hasAnyPermission
}   