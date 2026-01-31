import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { saveOTP } from "./otpStorage.js";
import logger from "./logger.js";
dotenv.config({ quiet: true });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const OTP_EXPIRY_MINUTES = 10;

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTPEmail = async (email) => {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    
    saveOTP(email, otp, expiresAt);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification - OTP Code",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Email Verification</h2>
                <p>Your OTP code is:</p>
                <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        logger.error(`Failed to send OTP email to ${email}: ${error.message}`);
        const emailError = new Error("Failed to send OTP email. Please check your email configuration.");
        emailError.originalError = error.message;
        throw emailError;
    }
};

export default { generateOTP, sendOTPEmail };
