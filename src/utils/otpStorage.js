import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OTP_FILE = path.join(__dirname, "../database/otp.json");

export const readOTPs = () => {
    try {
        const data = fs.readFileSync(OTP_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

export const writeOTPs = (otps) => {
    fs.writeFileSync(OTP_FILE, JSON.stringify(otps, null, 2));
};

export const saveOTP = (email, otp, expiresAt) => {
    const otps = readOTPs();
    const filtered = otps.filter(item => item.email !== email);
    filtered.push({ email, otp, expiresAt: expiresAt.toISOString() });
    writeOTPs(filtered);
};

export const findOTP = (email, otp) => {
    const otps = readOTPs();
    const record = otps.find(item => item.email === email && item.otp === otp);
    if (!record) return null;
    
    if (new Date(record.expiresAt) < new Date()) {
        return null;
    }
    return record;
};

export const deleteOTP = (email) => {
    const otps = readOTPs();
    const filtered = otps.filter(item => item.email !== email);
    writeOTPs(filtered);
};

export const cleanExpiredOTPs = () => {
    const otps = readOTPs();
    const now = new Date();
    const valid = otps.filter(item => new Date(item.expiresAt) > now);
    writeOTPs(valid);
};
