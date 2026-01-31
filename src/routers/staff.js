import { Router } from "express";
import staffController from "../controllers/staff.js";
import access from "../access/access.js";
import { validate, staffCreateSchema, staffUpdateSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/staff/me", access.authMiddleware, staffController.getMe)
    .get("/staff", access.authMiddleware, access.permissionMiddleware('staffs', 'read'), staffController.getAll)
    .get("/staff/search", access.authMiddleware, access.permissionMiddleware('staffs', 'read'), staffController.search)
    .get("/staff/:id", access.authMiddleware, access.permissionMiddleware('staffs', 'read'), staffController.getOne)
    .post("/staff", access.authMiddleware, access.permissionMiddleware('staffs', 'create'), validate(staffCreateSchema), staffController.create)
    .put("/staff/:id", access.authMiddleware, access.permissionMiddleware('staffs', 'update'), validate(staffUpdateSchema), staffController.put)
    .delete("/staff/:id", access.authMiddleware, access.permissionMiddleware('staffs', 'delete'), staffController.delete)
export default router