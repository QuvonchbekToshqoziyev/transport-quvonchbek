import adminController from "../controllers/admin.js";
import access from "../access/access.js";
import { Router } from "express";
import { validate, adminPromoteSchema, adminUpdateSchema, branchManagerPromoteSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/admin", access.authMiddleware, access.superadminMiddleware, adminController.getAll)
    .get("/admin/branch/:branch", access.authMiddleware, access.branchmanagerMiddleware, access.branchAccessMiddleware, adminController.getBranch)
    .get("/admin/:id", access.authMiddleware, access.superadminMiddleware, adminController.getOne)
    .post("/admin/promote-branchmanager", access.authMiddleware, access.superadminMiddleware, validate(branchManagerPromoteSchema), adminController.promoteToBranchManager)
    .delete("/admin/demote-branchmanager/:id", access.authMiddleware, access.superadminMiddleware, adminController.demoteBranchManager)

export default router