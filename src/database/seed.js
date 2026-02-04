import { Pool } from "pg";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

const pool = new Pool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});

async function seed() {
    try {
        const hashedPassword = await bcrypt.hash("password123", SALT_ROUNDS);

        await pool.query("DELETE FROM admins");
        await pool.query("DELETE FROM staffs");
        await pool.query("DELETE FROM transports");
        await pool.query("DELETE FROM branches");

        await pool.query("ALTER SEQUENCE branches_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE transports_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE staffs_id_seq RESTART WITH 1");
        await pool.query("ALTER SEQUENCE admins_id_seq RESTART WITH 1");

        await pool.query(`
            INSERT INTO branches (name, address) VALUES 
            ('Main Branch', '123 Main Street, Tashkent'),
            ('North Branch', '456 North Avenue, Samarkand'),
            ('South Branch', '789 South Road, Bukhara')
        `);

        await pool.query(`
            INSERT INTO transports (branch, model, color, price) VALUES 
            (1, 'Lacetti', 'white', 15000.00),
            (1, 'Nexia', 'black', 12000.00),
            (1, 'Malibu', 'silver', 28000.00),
            (1, 'Cobalt', 'blue', 14000.00),
            (2, 'Spark', 'red', 8000.00),
            (2, 'Damas', 'white', 7500.00),
            (2, 'Lacetti', 'grey', 15500.00),
            (3, 'Malibu', 'black', 29000.00),
            (3, 'Tracker', 'white', 32000.00),
            (3, 'Equinox', 'blue', 35000.00)
        `);

        await pool.query(`
            INSERT INTO staffs (branch, username, email, password, birth_date, gender, role) VALUES 
            (1, 'admin1', 'admin1@transport.com', $1, '1990-01-15', 'male', 'staff'),
            (1, 'manager1', 'manager1@transport.com', $1, '1985-05-20', 'male', 'branchmanager'),
            (2, 'staff2', 'staff2@transport.com', $1, '1992-08-10', 'female', 'staff'),
            (2, 'manager2', 'manager2@transport.com', $1, '1988-03-25', 'female', 'branchmanager'),
            (3, 'staff3', 'staff3@transport.com', $1, '1995-11-30', 'male', 'staff')
        `, [hashedPassword]);

        await pool.query(`
            INSERT INTO admins (staff, permission_model, permission) VALUES 
            (1, 'transports', '{create,read,update,delete}'),
            (1, 'staffs', '{read}'),
            (2, 'transports', '{create,read,update,delete}'),
            (2, 'staffs', '{create,read,update,delete}'),
            (2, 'branches', '{read,update}'),
            (3, 'transports', '{read}'),
            (4, 'transports', '{create,read,update,delete}'),
            (4, 'staffs', '{create,read,update,delete}'),
            (4, 'branches', '{read,update}')
        `);

        await pool.end();
        process.exit(0);
    } catch (error) {
        await pool.end();
        process.exit(1);
    }
}

seed();
