import { Router } from "express";
import branchController from "../controllers/branch.js";
import access from "../access/access.js";
import { validate, branchCreateSchema, branchUpdateSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/branch", access.authMiddleware, access.superadminMiddleware, branchController.getAll)
    .get("/branch/search", access.authMiddleware, access.superadminMiddleware, branchController.search)
    .get("/branch/:id/allinfo", access.authMiddleware, access.branchmanagerMiddleware, access.branchAccessMiddleware, branchController.allInfo)
    .get("/branch/:id", access.authMiddleware, access.branchAccessMiddleware, branchController.getOne)
    .post("/branch", access.authMiddleware, access.superadminMiddleware, validate(branchCreateSchema), branchController.create)
    .put("/branch/:id", access.authMiddleware, access.superadminMiddleware, validate(branchUpdateSchema), branchController.put)
    .delete("/branch/:id", access.authMiddleware, access.superadminMiddleware, branchController.delete)
export default router