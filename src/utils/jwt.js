import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export default {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken
};
