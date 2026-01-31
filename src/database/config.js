import { config } from "dotenv";
import { Pool } from "pg";
import logger from "../utils/logger.js";
config({ quiet: true })

const pool = new Pool({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD
}) 

async function db_connect() {
    try {
        await pool.connect()
        logger.info("Database connected!")
    } catch (error) {
        logger.error("Database connection failed:", error)
    }
}

db_connect()

export default pool
