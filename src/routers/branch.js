import { Router } from "express";
import branchController from "../controllers/branch.js";
import { checkToken } from "../middleware/auth.js";
import { roleGuard, branchAccessMiddleware } from "../middleware/authorize.js";
import { validate, branchCreateSchema, branchUpdateSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/branch", checkToken, roleGuard(["superadmin"]), branchController.getAll)
    .get("/branch/search", checkToken, roleGuard(["superadmin"]), branchController.search)
    .get("/branch/:id/allinfo", checkToken, roleGuard(["branchmanager", "superadmin"]), branchAccessMiddleware, branchController.allInfo)
    .get("/branch/:id", checkToken, branchAccessMiddleware, branchController.getOne)
    .post("/branch", checkToken, roleGuard(["superadmin"]), validate(branchCreateSchema), branchController.create)
    .put("/branch/:id", checkToken, roleGuard(["superadmin"]), validate(branchUpdateSchema), branchController.put)
    .delete("/branch/:id", checkToken, roleGuard(["superadmin"]), branchController.delete)
export default router