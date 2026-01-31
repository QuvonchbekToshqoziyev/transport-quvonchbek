import Joi from "joi";
import { ValidationError } from "../utils/errors.js";

export const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const message = error.details.map(d => d.message).join(', ');
            throw new ValidationError(400, message);
        }
        next();
    };
};

export const transportCreateSchema = Joi.object({
    branch: Joi.number().required(),
    model: Joi.string().required(),
    color: Joi.string().required(),
    img: Joi.string().optional(),
    price: Joi.number().required()
});

export const transportUpdateSchema = Joi.object({
    branch: Joi.number().optional(),
    model: Joi.string().optional(),
    color: Joi.string().optional(),
    img: Joi.string().optional(),
    price: Joi.number().optional()
}).min(1);

export const branchCreateSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required()
});

export const branchUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    address: Joi.string().optional()
}).min(1);

export const staffCreateSchema = Joi.object({
    branch: Joi.number().required(),
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).required(),
    birth_date: Joi.date().required(),
    gender: Joi.string().valid('male', 'female').required()
});

export const staffUpdateSchema = Joi.object({
    branch: Joi.number().optional(),
    username: Joi.string().min(3).max(100).optional(),
    password: Joi.string().min(6).optional(),
    birth_date: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female').optional()
}).min(1);

const permissionModels = ["branches", "transports", "staffs", "admins"];
const permissions = ["create", "read", "delete", "update"];

export const adminPromoteSchema = Joi.object({
    staff: Joi.number().required(),
    permission_model: Joi.string().valid(...permissionModels).required(),
    permission: Joi.array().items(Joi.string().valid(...permissions)).required()
});

export const adminUpdateSchema = Joi.object({
    permission_model: Joi.string().valid(...permissionModels).optional(),
    permission: Joi.array().items(Joi.string().valid(...permissions)).optional()
}).min(1);

export const branchManagerPromoteSchema = Joi.object({
    staff: Joi.number().required()
});

export const addPermissionSchema = Joi.object({
    staff: Joi.number().required(),
    permission_model: Joi.string().valid(...permissionModels).required(),
    permission: Joi.array().items(Joi.string().valid(...permissions)).min(1).required()
});

export const deletePermissionSchema = Joi.object({
    staff: Joi.number().required(),
    permission_model: Joi.string().valid(...permissionModels).required()
});

export const changePermissionSchema = Joi.object({
    staff: Joi.number().required(),
    permission_model: Joi.string().valid(...permissionModels).required(),
    permission: Joi.array().items(Joi.string().valid(...permissions)).min(1).required()
});

export const authSendOTPSchema = Joi.object({
    email: Joi.string().email().required()
});

export const authRegisterSchema = Joi.object({
    branch: Joi.number().required(),
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    birth_date: Joi.date().required(),
    gender: Joi.string().valid('male', 'female').required(),
    otp: Joi.string().length(6).required()
});

export const authLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const authRefreshSchema = Joi.object({
    refreshToken: Joi.string().required()
});