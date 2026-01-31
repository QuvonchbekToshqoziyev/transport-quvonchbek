import pool from "../database/config.js";
import { NotFoundError, BadRequestError } from "../utils/errors.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

class StaffService{
    async getMe(userId){
        const data = await pool.query(
            "SELECT id, branch, username, email, birth_date, gender, role, created_at FROM staffs WHERE id=$1",
            [userId]
        )
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Staff not found")
        }
        return{
            status:200,
            message: "Your info retrieved successfully",
            data: data.rows[0]
        }
    }

    async getAll(){
        const data = await pool.query("SELECT id, branch, username, birth_date, gender, role, created_at FROM staffs")
        if (data.rows.length === 0) {
            throw new NotFoundError(404, "No staff found")
        }
        return{
            status:200,
            message: "Staff retrieved successfully",
            data: data.rows
        }
    }

    async search(query){
        const { username, branch } = query;
        
        let sql = "SELECT id, branch, username, email, birth_date, gender, role, created_at FROM staffs WHERE 1=1";
        const values = [];
        let paramCount = 1;

        if (username) {
            sql += ` AND LOWER(username) LIKE LOWER($${paramCount})`;
            values.push(`%${username}%`);
            paramCount++;
        }

        if (branch) {
            sql += ` AND branch = $${paramCount}`;
            values.push(branch);
            paramCount++;
        }

        const data = await pool.query(sql, values);
        
        return {
            status: 200,
            message: `Found ${data.rows.length} staff members`,
            data: data.rows
        };
    }

    async getOne(id){
        const data = await pool.query("SELECT id, branch, username, birth_date, gender, role, created_at FROM staffs WHERE id=$1",[id])
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Staff not found")
        }
        return{
            status:200,
            message: "Staff retrieved successfully",
            data: data.rows[0]
        }
    }
    async create(body){
        const {branch, username, password, birth_date, gender} = body
        if (!branch || !username || !password || !birth_date || !gender) {
            throw new BadRequestError(400, "Missing required fields: branch, username, password, birth_date, gender")
        }
        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        
        const data = await pool.query(
            "INSERT INTO staffs (branch, username, password, birth_date, gender) VALUES ($1,$2,$3,$4,$5) RETURNING id, branch, username, birth_date, gender, role, created_at",
            [branch, username, hashedPassword, birth_date, gender]
        )  
        return{
            status:201,
            message: "Staff created successfully",
            data: data.rows[0]
        }
    }
    async put(id, body){
        const fields = ['branch', 'username', 'password', 'birth_date', 'gender']
        const updates = []
        const values = []
        let paramCount = 1

        for (const field of fields) {
            if (body[field] !== undefined) {
                let value = body[field]
                if (field === 'password') {
                    value = await bcrypt.hash(value, SALT_ROUNDS)
                }
                updates.push(`${field}=$${paramCount}`)
                values.push(value)
                paramCount++
            }
        }

        if (updates.length === 0) {
            throw new BadRequestError(400, "No fields to update")
        }

        values.push(id)
        const query = `UPDATE staffs SET ${updates.join(', ')} WHERE id=$${paramCount} RETURNING id, branch, username, birth_date, gender, role, created_at`
        const data = await pool.query(query, values)
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Staff not found")
        }
        return{
            status:200,
            message: "Staff updated successfully",
            data: data.rows[0]
        }
    }
    async delete(id){
        const data = await pool.query("DELETE FROM staffs WHERE id=$1 RETURNING id, branch, username, birth_date, gender, role",[id])
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Staff not found")
        }
        
        return{
            status:200,
            message: "Staff deleted successfully",
            data: data.rows[0]
        }
    }
}

export default new StaffService()