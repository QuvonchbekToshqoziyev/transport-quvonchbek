import { Router } from "express";
import transportController from "../controllers/transport.js";
import upload from "../utils/upload.js";
import { checkToken } from "../middleware/auth.js";
import { roleGuard, transportBranchScopeMiddleware } from "../middleware/authorize.js";
import { validate, transportCreateSchema, transportUpdateSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/transport", transportController.getAll)
    .get("/transport/search", transportController.search)
    .get("/transport/branch/:branchId", transportController.getByBranch)
    .get("/transport/:id", transportController.getOne)
    .post("/transport", checkToken, roleGuard(["staff", "superadmin"]), transportBranchScopeMiddleware, upload.single("img"), validate(transportCreateSchema), transportController.create)
    .put("/transport/:id", checkToken, roleGuard(["staff", "superadmin"]), transportBranchScopeMiddleware, upload.single("img"), validate(transportUpdateSchema), transportController.put)
    .delete("/transport/:id", checkToken, roleGuard(["staff", "superadmin"]), transportBranchScopeMiddleware, transportController.delete)
export default router