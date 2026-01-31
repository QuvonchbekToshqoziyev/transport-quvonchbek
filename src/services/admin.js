import pool from "../database/config.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

class adminService{
    async getAll(){
        const data = await pool.query(`
            SELECT a.*, s.username, s.branch 
            FROM admins a 
            JOIN staffs s ON a.staff = s.id
        `)
        if (data.rows.length === 0) {
            throw new NotFoundError(404, "No admins found")
        }
        return{
            status:200,
            message: "Admins retrieved successfully",
            data: data.rows
        }
    }

    async getOne(id){
        const data = await pool.query(`
            SELECT a.*, s.username, s.branch 
            FROM admins a 
            JOIN staffs s ON a.staff = s.id 
            WHERE a.id=$1
        `,[id])
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Admin not found")
        }
        return{
            status:200,
            message: "Admin retrieved successfully",
            data: data.rows[0]
        }
    }

    async getBranch(branchId){
        const data = await pool.query(`
            SELECT a.*, s.username, s.branch 
            FROM admins a 
            JOIN staffs s ON a.staff = s.id 
            WHERE s.branch = $1
        `,[branchId])
        if (data.rows.length === 0) {
            throw new NotFoundError(404, "No admins found in this branch")
        }
        return{
            status:200,
            message: "Admins in branch retrieved successfully",
            data: data.rows
        }
    }

    async promote(body){
        const { staff, permission_model, permission } = body
        if (!staff || !permission_model || !permission) {
            throw new BadRequestError(400, "Missing required fields: staff, permission_model, permission")
        }
        
        const staffCheck = await pool.query("SELECT * FROM staffs WHERE id=$1", [staff])
        if (!staffCheck.rows[0]) {
            throw new NotFoundError(404, "Staff not found")
        }
        
        const adminCheck = await pool.query("SELECT * FROM admins WHERE staff=$1", [staff])
        if (adminCheck.rows[0]) {
            throw new BadRequestError(400, "Staff is already an admin")
        }
        
        const data = await pool.query(
            "INSERT INTO admins (staff, permission_model, permission) VALUES ($1, $2, $3) RETURNING *",
            [staff, permission_model, permission]
        )
        
        await pool.query("UPDATE staffs SET role = 'admin' WHERE id = $1", [staff])
        
        return{
            status:201,
            message: "Staff promoted to admin successfully",
            data: data.rows[0]
        }
    }

    async promoteToBranchManager(body){
        const { staff } = body
        if (!staff) {
            throw new BadRequestError(400, "Missing required field: staff")
        }
        
        const staffCheck = await pool.query("SELECT * FROM staffs WHERE id=$1", [staff])
        if (!staffCheck.rows[0]) {
            throw new NotFoundError(404, "Staff not found")
        }
        
        if (staffCheck.rows[0].role === 'branchmanager') {
            throw new BadRequestError(400, "Staff is already a branch manager")
        }

        if (staffCheck.rows[0].role === 'superadmin') {
            throw new BadRequestError(400, "Cannot change superadmin role")
        }
        
        const data = await pool.query(
            "UPDATE staffs SET role = 'branchmanager' WHERE id = $1 RETURNING id, branch, username, email, role",
            [staff]
        )
        
        const models = ['branches', 'transports', 'staffs', 'admins']
        const allPermissions = ['create', 'read', 'update', 'delete']
        
        for (const model of models) {
            const existing = await pool.query(
                "SELECT * FROM admins WHERE staff = $1 AND permission_model = $2",
                [staff, model]
            )
            
            if (existing.rows[0]) {
                await pool.query(
                    "UPDATE admins SET permission = $1 WHERE staff = $2 AND permission_model = $3",
                    [allPermissions, staff, model]
                )
            } else {
                await pool.query(
                    "INSERT INTO admins (staff, permission_model, permission) VALUES ($1, $2, $3)",
                    [staff, model, allPermissions]
                )
            }
        }
        
        return{
            status:201,
            message: "Staff promoted to branch manager successfully",
            data: data.rows[0]
        }
    }

    async demoteBranchManager(id){
        const staff = await pool.query("SELECT * FROM staffs WHERE id=$1", [id])
        if (!staff.rows[0]) {
            throw new NotFoundError(404, "Staff not found")
        }
        
        if (staff.rows[0].role !== 'branchmanager') {
            throw new BadRequestError(400, "Staff is not a branch manager")
        }
        
        await pool.query("UPDATE staffs SET role = 'staff' WHERE id = $1", [id])
        
        await pool.query("DELETE FROM admins WHERE staff = $1", [id])
        
        return{
            status:200,
            message: "Branch manager demoted successfully"
        }
    }

    async put(id, body){
        const fields = ['permission_model', 'permission']
        const updates = []
        const values = []
        let paramCount = 1

        for (const field of fields) {
            if (body[field] !== undefined) {
                updates.push(`${field}=$${paramCount}`)
                values.push(body[field])
                paramCount++
            }
        }

        if (updates.length === 0) {
            throw new BadRequestError(400, "No fields to update")
        }

        values.push(id)
        const query = `UPDATE admins SET ${updates.join(', ')} WHERE id=$${paramCount} RETURNING *`
        const data = await pool.query(query, values)
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Admin not found")
        }
        return{
            status:200,
            message: "Admin updated successfully",
            data: data.rows[0]
        }
    }

    async demote(id){
        const admin = await pool.query("SELECT * FROM admins WHERE id=$1", [id])
        if (!admin.rows[0]) {
            throw new NotFoundError(404, "Admin not found")
        }
        
        const staffId = admin.rows[0].staff
        
        const data = await pool.query("DELETE FROM admins WHERE id=$1 RETURNING *",[id])
        
        await pool.query("UPDATE staffs SET role = 'staff' WHERE id = $1", [staffId])
        
        return{
            status:200,
            message: "Admin demoted successfully",
            data: data.rows[0]
        }
    }

    async getOwnPermissions(staffId, role){
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
            }
        }

        const data = await pool.query(
            "SELECT permission_model, permission FROM admins WHERE staff = $1",
            [staffId]
        )

        return {
            status: 200,
            message: "Permissions retrieved successfully",
            data: {
                role: role,
                permissions: data.rows
            }
        }
    }
}

export default new adminService()