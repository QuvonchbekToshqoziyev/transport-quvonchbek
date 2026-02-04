import pool from "../database/config.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { sendOTPEmail } from "../utils/email.js";
import { findOTP, deleteOTP } from "../utils/otpStorage.js";
import { BadRequestError, UnauthorizedError, InternalServerError } from "../utils/errors.js";

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

class AuthService {
    async sendOTP(body) {
        const { email } = body;

        if (!email) {
            throw new BadRequestError(400, "Email is required");
        }

        const existingStaff = await pool.query("SELECT * FROM staffs WHERE email = $1", [email]);
        if (existingStaff.rows[0]) {
            throw new BadRequestError(400, "Email already registered. Please login.");
        }

        try {
            await sendOTPEmail(email);
            return {
                status: 200,
                message: "OTP sent successfully to your email"
            };
        } catch (error) {
            throw new InternalServerError(500, "Failed to send OTP email. Please try again later.");
        }
    }

    async register(body) {
        const { branch, username, email, password, birth_date, gender, otp } = body;
        
        if (!branch || !username || !email || !password || !birth_date || !gender || !otp) {
            throw new BadRequestError(400, "Missing required fields: branch, username, email, password, birth_date, gender, otp");
        }

        const otpRecord = findOTP(email, otp);

        if (!otpRecord) {
            throw new BadRequestError(400, "Invalid or expired OTP");
        }

        const emailCheck = await pool.query("SELECT * FROM staffs WHERE email = $1", [email]);
        if (emailCheck.rows[0]) {
            throw new BadRequestError(400, "Email already registered");
        }

        const usernameCheck = await pool.query("SELECT * FROM staffs WHERE username = $1", [username]);
        if (usernameCheck.rows[0]) {
            throw new BadRequestError(400, "Username already taken");
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const data = await pool.query(
            "INSERT INTO staffs (branch, username, email, password, birth_date, gender) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, branch, username, email, birth_date, gender, role, created_at",
            [branch, username, email, hashedPassword, birth_date, gender]
        );

        deleteOTP(email);

        return {
            status: 201,
            message: "Registration successful",
            data: data.rows[0]
        };
    }

    async resendOTP(body) {
        const { email } = body;

        if (!email) {
            throw new BadRequestError(400, "Email is required");
        }

        try {
            await sendOTPEmail(email);
            return {
                status: 200,
                message: "OTP sent successfully"
            };
        } catch (error) {
            throw new InternalServerError(500, "Failed to send OTP email. Please try again later.");
        }
    }

    async login(body, ip, userAgent) {
        const { email, password } = body;

        if (!email || !password) {
            throw new BadRequestError(400, "Missing required fields: email, password");
        }

        const superadminEmail = process.env.SUPERADMIN_EMAIL;
        const superadminPassword = process.env.SUPERADMIN_PASSWORD;
        const superadminUsername = process.env.SUPERADMIN_USERNAME;

        if (email === superadminEmail) {
            if (password !== superadminPassword) {
                throw new UnauthorizedError(401, "Invalid email or password");
            }

            const payload = {
                id: 'superadmin',
                username: superadminUsername,
                ip: ip,
                userAgent: userAgent,
                keyword: process.env.JWT_KEYWORD
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            return {
                status: 200,
                message: "SuperAdmin login successful",
                data: {
                    user: {
                        id: 'superadmin',
                        username: superadminUsername,
                        email: superadminEmail,
                        role: 'superadmin',
                        branch: null
                    },
                    accessToken,
                    refreshToken
                }
            };
        }

        const staff = await pool.query("SELECT * FROM staffs WHERE email = $1", [email]);
        if (!staff.rows[0]) {
            throw new UnauthorizedError(401, "Invalid email or password");
        }

        const validPassword = await bcrypt.compare(password, staff.rows[0].password);
        if (!validPassword) {
            throw new UnauthorizedError(401, "Invalid email or password");
        }
        const payload = {
            id: staff.rows[0].id,
            username: staff.rows[0].username,
            ip: ip,
            userAgent: userAgent,
            keyword: process.env.JWT_KEYWORD
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {
            status: 200,
            message: "Login successful",
            data: {
                user: {
                    id: staff.rows[0].id,
                    username: staff.rows[0].username,
                    email: staff.rows[0].email,
                    role: staff.rows[0].role,
                    branch: staff.rows[0].branch
                },
                accessToken,
                refreshToken
            }
        };
    }

    async refreshToken(body, ip, userAgent) {
        const { refreshToken } = body;

        if (!refreshToken) {
            throw new BadRequestError(400, "Refresh token is required");
        }

        try {
            const { verifyRefreshToken, generateAccessToken } = await import("../utils/jwt.js");
            const decoded = verifyRefreshToken(refreshToken);

            const payload = {
                id: decoded.id,
                username: decoded.username,
                ip: ip,
                userAgent: userAgent,
                keyword: process.env.JWT_KEYWORD
            };

            const newAccessToken = generateAccessToken(payload);

            return {
                status: 200,
                message: "Token refreshed successfully",
                data: { accessToken: newAccessToken }
            };
        } catch (error) {
            throw new UnauthorizedError(401, "Invalid or expired refresh token");
        }
    }
}

export default new AuthService();
