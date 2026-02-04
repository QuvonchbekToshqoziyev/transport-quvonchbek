import { Router } from "express";
import staffController from "../controllers/staff.js";
import { checkToken } from "../middleware/auth.js";
import { roleGuard, staffBranchScopeMiddleware } from "../middleware/authorize.js";
import { validate, staffCreateSchema, staffUpdateSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/staff/me", checkToken, staffController.getMe)
    .get("/staff", checkToken, roleGuard(["admin", "branchmanager", "superadmin"]), staffBranchScopeMiddleware, staffController.getAll)
    .get("/staff/search", checkToken, roleGuard(["admin", "branchmanager", "superadmin"]), staffBranchScopeMiddleware, staffController.search)
    .get("/staff/:id", checkToken, roleGuard(["admin", "branchmanager", "superadmin"]), staffBranchScopeMiddleware, staffController.getOne)
    .post("/staff", checkToken, roleGuard(["admin", "superadmin"]), staffBranchScopeMiddleware, validate(staffCreateSchema), staffController.create)
    .put("/staff/:id", checkToken, roleGuard(["admin", "superadmin"]), staffBranchScopeMiddleware, validate(staffUpdateSchema), staffController.put)
    .delete("/staff/:id", checkToken, roleGuard(["admin", "superadmin"]), staffBranchScopeMiddleware, staffController.delete)
export default router