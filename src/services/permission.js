import pool from "../database/config.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

class PermissionService {
    async addPermission(body) {
        const { staff, permission_model, permission } = body;
        
        if (!staff || !permission_model || !permission) {
            throw new BadRequestError(400, "Missing required fields: staff, permission_model, permission");
        }

        const staffCheck = await pool.query("SELECT * FROM staffs WHERE id=$1", [staff]);
        if (!staffCheck.rows[0]) {
            throw new NotFoundError(404, "Staff not found");
        }

        const existingPermission = await pool.query(
            "SELECT * FROM admins WHERE staff = $1 AND permission_model = $2",
            [staff, permission_model]
        );
        
        if (existingPermission.rows[0]) {
            throw new BadRequestError(400, `Staff already has permissions for '${permission_model}'. Use changePermission to update.`);
        }

        const data = await pool.query(
            "INSERT INTO admins (staff, permission_model, permission) VALUES ($1, $2, $3) RETURNING *",
            [staff, permission_model, permission]
        );

        if (staffCheck.rows[0].role === 'staff') {
            await pool.query("UPDATE staffs SET role = 'admin' WHERE id = $1", [staff]);
        }

        return {
            status: 201,
            message: "Permission added successfully",
            data: data.rows[0]
        };
    }

    async deletePermission(body) {
        const { staff, permission_model } = body;
        
        if (!staff || !permission_model) {
            throw new BadRequestError(400, "Missing required fields: staff, permission_model");
        }

        const existingPermission = await pool.query(
            "SELECT * FROM admins WHERE staff = $1 AND permission_model = $2",
            [staff, permission_model]
        );
        
        if (!existingPermission.rows[0]) {
            throw new NotFoundError(404, `Staff doesn't have permissions for '${permission_model}'`);
        }

        const data = await pool.query(
            "DELETE FROM admins WHERE staff = $1 AND permission_model = $2 RETURNING *",
            [staff, permission_model]
        );

        const remainingPermissions = await pool.query(
            "SELECT * FROM admins WHERE staff = $1",
            [staff]
        );

        if (remainingPermissions.rows.length === 0) {
            await pool.query("UPDATE staffs SET role = 'staff' WHERE id = $1", [staff]);
        }

        return {
            status: 200,
            message: "Permission deleted successfully",
            data: data.rows[0]
        };
    }

    async changePermission(body) {
        const { staff, permission_model, permission } = body;
        
        if (!staff || !permission_model || !permission) {
            throw new BadRequestError(400, "Missing required fields: staff, permission_model, permission");
        }

        const existingPermission = await pool.query(
            "SELECT * FROM admins WHERE staff = $1 AND permission_model = $2",
            [staff, permission_model]
        );
        
        if (!existingPermission.rows[0]) {
            throw new NotFoundError(404, `Staff doesn't have permissions for '${permission_model}'. Use addPermission first.`);
        }

        const data = await pool.query(
            "UPDATE admins SET permission = $1 WHERE staff = $2 AND permission_model = $3 RETURNING *",
            [permission, staff, permission_model]
        );

        return {
            status: 200,
            message: "Permission updated successfully",
            data: data.rows[0]
        };
    }

    async allPermissions(staffId) {
        const staffCheck = await pool.query(
            "SELECT id, username, email, role, branch FROM staffs WHERE id=$1", 
            [staffId]
        );
        if (!staffCheck.rows[0]) {
            throw new NotFoundError(404, "Staff not found");
        }

        const permissions = await pool.query(
            "SELECT id, permission_model, permission FROM admins WHERE staff = $1",
            [staffId]
        );

        return {
            status: 200,
            message: "Permissions retrieved successfully",
            data: {
                staff: staffCheck.rows[0],
                permissions: permissions.rows
            }
        };
    }

    async ownPermissions(staffId, role) {
        if (role === 'superadmin') {
            return {
                status: 200,
                message: "Permissions retrieved successfully",
                data: {
                    role: 'superadmin',
                    permissions: [
                        { permission_model: 'branches', permission: ['create', 'read', 'update', 'delete'] },
                        { permission_model: 'transports', permission: ['create', 'read', 'update', 'delete'] },
                        { permission_model: 'staffs', permission: ['create', 'read', 'update', 'delete'] },
                        { permission_model: 'admins', permission: ['create', 'read', 'update', 'delete'] }
                    ]
                }
            };
        }

        const data = await pool.query(
            "SELECT permission_model, permission FROM admins WHERE staff = $1",
            [staffId]
        );

        return {
            status: 200,
            message: "Permissions retrieved successfully",
            data: {
                role: role,
                permissions: data.rows
            }
        };
    }
}

export default new PermissionService();
