import pool from "../database/config.js";


export const roleGuard = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                status: 401,
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 403,
                message: `Access denied. Required roles: ${allowedRoles.join(", ")}`
            });
        }

        next();
    };
};


export const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin' && 
        req.user.role !== 'branchmanager' && 
        req.user.role !== 'superadmin') {
        return res.sendStatus(403);
    }
    next();
};


export const staffMiddleware = (req, res, next) => {
    if (req.user.role !== 'staff' && req.user.role !== 'admin') {
        return res.sendStatus(403);
    }
    next();
};


export const superadminMiddleware = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        return res.sendStatus(403);
    }
    next();
};


export const branchmanagerMiddleware = (req, res, next) => {
    if (req.user.role !== 'branchmanager' && req.user.role !== 'superadmin') {
        return res.sendStatus(403);
    }
    next();
};

export const branchAccessMiddleware = (req, res, next) => {
    if (req.user.role === 'superadmin') {
        return next();
    }

    const requestedBranch = parseInt(req.params.id || req.params.branch || req.params.branchId);
    
    if (req.user.branch !== requestedBranch) {
        return res.status(403).json({
            status: 403,
            message: "Access denied. You can only access your own branch."
        });
    }
    
    next();
};

export const staffBranchScopeMiddleware = async (req, res, next) => {
    if (req.user.role === 'superadmin' || req.user.role === 'admin') {
        return next();
    }

    if (req.user.role === 'branchmanager') {
        req.branchScopeRequired = true;
        return next();
    }

    next();
};

export const transportBranchScopeMiddleware = async (req, res, next) => {
    if (req.user.role === 'superadmin') {
        return next();
    }

    if (req.user.role === 'staff') {
        req.branchScopeRequired = true;
        return next();
    }

    next();
};

export const permissionMiddleware = (model, action) => {
    return async (req, res, next) => {
        try {
            if (req.user.role === 'superadmin') {
                return next();
            }

            if (req.user.role !== 'admin' && req.user.role !== 'branchmanager') {
                return res.status(403).json({ 
                    status: 403, 
                    message: "Access denied. Admin privileges required." 
                });
            }

            const result = await pool.query(
                `SELECT * FROM admins 
                 WHERE staff = $1 
                 AND permission_model = $2 
                 AND $3 = ANY(permission)`,
                [req.user.id, model, action]
            );

            if (!result.rows[0]) {
                return res.status(403).json({ 
                    status: 403, 
                    message: `Access denied. You don't have '${action}' permission for '${model}'.` 
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error checking permissions" 
            });
        }
    };
};

export const hasAnyPermission = (model) => {
    return async (req, res, next) => {
        try {
            if (req.user.role === 'superadmin') {
                return next();
            }

            const result = await pool.query(
                `SELECT * FROM admins WHERE staff = $1 AND permission_model = $2`,
                [req.user.id, model]
            );

            if (!result.rows[0]) {
                return res.status(403).json({ 
                    status: 403, 
                    message: `Access denied. No permissions for '${model}'.` 
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ 
                status: 500, 
                message: "Error checking permissions" 
            });
        }
    };
};

export default {
    roleGuard,
    adminMiddleware,
    staffMiddleware,
    superadminMiddleware,
    branchmanagerMiddleware,
    branchAccessMiddleware,
    staffBranchScopeMiddleware,
    transportBranchScopeMiddleware,
    permissionMiddleware,
    hasAnyPermission
};
