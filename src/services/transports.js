import pool from "../database/config.js"
import { NotFoundError, BadRequestError } from "../utils/errors.js";

class transportService{
    async getAll(){
        const data = await pool.query("SELECT * FROM transports")
        if (data.rows.length === 0) {
            throw new NotFoundError(404, "No transports found")
        }
        return{
            status:200,
            message: "Transports retrieved successfully",
            data: data.rows
        }
    }

    async search(query){
        const { branch, color, model, minPrice, maxPrice } = query;
        
        let sql = "SELECT * FROM transports WHERE 1=1";
        const values = [];
        let paramCount = 1;

        if (branch) {
            sql += ` AND branch = $${paramCount}`;
            values.push(branch);
            paramCount++;
        }

        if (color) {
            sql += ` AND LOWER(color) LIKE LOWER($${paramCount})`;
            values.push(`%${color}%`);
            paramCount++;
        }

        if (model) {
            sql += ` AND LOWER(model) LIKE LOWER($${paramCount})`;
            values.push(`%${model}%`);
            paramCount++;
        }

        if (minPrice) {
            sql += ` AND price >= $${paramCount}`;
            values.push(minPrice);
            paramCount++;
        }

        if (maxPrice) {
            sql += ` AND price <= $${paramCount}`;
            values.push(maxPrice);
            paramCount++;
        }

        const data = await pool.query(sql, values);
        
        return {
            status: 200,
            message: `Found ${data.rows.length} transports`,
            data: data.rows
        };
    }

    async getOne(id){
        const data = await pool.query("SELECT * FROM transports WHERE id=$1",[id])
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Transport not found")
        }
        return{
            status:200,
            message: "Transport retrieved successfully",
            data: data.rows[0]
        }
    }

    async getByBranch(branchId){
        const branchCheck = await pool.query("SELECT * FROM branches WHERE id=$1", [branchId])
        if (!branchCheck.rows[0]) {
            throw new NotFoundError(404, "Branch not found")
        }

        const data = await pool.query("SELECT * FROM transports WHERE branch=$1", [branchId])
        
        return {
            status: 200,
            message: `Found ${data.rows.length} transports in branch`,
            data: data.rows
        }
    }

    async create(body){
        const {branch, model, color, img, price} = body
        if (!branch || !model || !color || !price) {
            throw new BadRequestError(400, "Missing required fields: branch, model, color, price")
        }
        const data = await pool.query("INSERT INTO transports (branch, model, color, img, price) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [branch, model, color, img, price])
        return{
            status:201,
            message: "Transport created successfully",
            data: data.rows[0]
        }
    }

    async put(id, body){
        const fields = ['branch', 'model', 'color', 'img', 'price']
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
        const query = `UPDATE transports SET ${updates.join(', ')} WHERE id=$${paramCount} RETURNING *`
        const data = await pool.query(query, values)
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Transport not found")
        }
        return{
            status:200,
            message: "Transport updated successfully",
            data: data.rows[0]
        }
    }

    async delete(id){
        const data = await pool.query("DELETE FROM transports WHERE id=$1 RETURNING *",[id])
        if (!data.rows[0]) {
            throw new NotFoundError(404, "Transport not found")
        }

        return{
            status:200,
            message: "Transport deleted successfully",
            data: data.rows[0]
        }
    }
}

export default new transportService()