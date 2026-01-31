import pool from "../database/config.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";

class branchService{
    async getAll(){
        const data = await pool.query("SELECT * FROM branches")
        if (data.rows.length === 0) {
            throw new NotFoundError(404, "No branches found")
        }
        return{
            status:200,
            message: "Branches retrieved successfully",
            data: data.rows
        }
    }

    async search(query){
        const { name, address } = query;
        
        let sql = "SELECT * FROM branches WHERE 1=1";
        const values = [];
        let paramCount = 1;

        if (name) {
            sql += ` AND LOWER(name) LIKE LOWER($${paramCount})`;
            values.push(`%${name}%`);
            paramCount++;
        }

        if (address) {
            sql += ` AND LOWER(address) LIKE LOWER($${paramCount})`;
            values.push(`%${address}%`);
            paramCount++;
        }

        const data = await pool.query(sql, values);
        
        return {
            status: 200,
            message: `Found ${data.rows.length} branches`,
            data: data.rows
        };
    }

    async getOne(id){
        const data = await pool.query("SELECT * FROM branches WHERE id=$1",[id])
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Branch not found")
        }
        return{
            status:200,
            message: "Branch retrieved successfully",
            data: data.rows[0]
        }
    }

    async create(body){
        const {name, address} = body
        if (!name || !address) {
            throw new BadRequestError(400, "Missing required fields: name, address")
        }
        const data = await pool.query("INSERT INTO branches (name, address) VALUES ($1,$2) RETURNING *",
        [name, address])  
        return{
            status:201,
            message: "Branch created successfully",
            data: data.rows[0]
        }
    }

    async put(id, body){
        const fields = ['name', 'address']
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
        const query = `UPDATE branches SET ${updates.join(', ')} WHERE id=$${paramCount} RETURNING *`
        const data = await pool.query(query, values)
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Branch not found")
        }
        return{
            status:200,
            message: "Branch updated successfully",
            data: data.rows[0]
        }
    }

    async delete(id){
        const data = await pool.query("DELETE FROM branches WHERE id=$1 RETURNING *",[id])
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Branch not found")
        }
        return{
            status:200,
            message: "Branch deleted successfully",
            data: data.rows[0]
        }
    }

    async allInfo(id){
        const branch = await pool.query("SELECT * FROM branches WHERE id=$1", [id])
        if (!branch.rows[0]) {
            throw new NotFoundError(404, "Branch not found")
        }

        const transports = await pool.query("SELECT * FROM transports WHERE branch=$1", [id])
        const staffs = await pool.query(
            "SELECT id, branch, username, email, birth_date, gender, role, created_at FROM staffs WHERE branch=$1", 
            [id]
        )

        return {
            status: 200,
            message: "Branch info retrieved successfully",
            data: {
                branch: branch.rows[0],
                transports: transports.rows,
                staffs: staffs.rows
            }
        }
    }
}

export default new branchService()