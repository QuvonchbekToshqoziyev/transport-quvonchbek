import adminController from "../controllers/admin.js";
import { checkToken } from "../middleware/auth.js";
import { roleGuard, branchAccessMiddleware } from "../middleware/authorize.js";
import { Router } from "express";
import { validate, adminPromoteSchema, adminUpdateSchema, branchManagerPromoteSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/admin", checkToken, roleGuard(["superadmin"]), adminController.getAll)
    .get("/admin/branch/:branch", checkToken, roleGuard(["branchmanager", "superadmin"]), branchAccessMiddleware, adminController.getBranch)
    .get("/admin/:id", checkToken, roleGuard(["branchmanager", "superadmin"]), adminController.getOne)
    .get("/admin/promote", checkToken, roleGuard(["branchmanager", "superadmin"]), validate(adminPromoteSchema), adminController.promote)
    .get("/admin/update/:id", checkToken, roleGuard(["branchmanager", "superadmin"]), validate(adminUpdateSchema), adminController.put)
    .post("/admin/promote-branchmanager", checkToken, roleGuard(["superadmin"]), validate(branchManagerPromoteSchema), adminController.promoteToBranchManager)
    .delete("/admin/demote-branchmanager/:id", checkToken, roleGuard(["superadmin"]), adminController.demoteBranchManager)

export default router