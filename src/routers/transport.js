import { Router } from "express";
import transportController from "../controllers/transport.js";
import upload from "../utils/upload.js";
import access from "../access/access.js";
import { validate, transportCreateSchema, transportUpdateSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/transport", transportController.getAll)
    .get("/transport/search", transportController.search)
    .get("/transport/branch/:branchId", transportController.getByBranch)
    .get("/transport/:id", transportController.getOne)
    .post("/transport", access.authMiddleware, access.permissionMiddleware('transports', 'create'), upload.single("img"), validate(transportCreateSchema), transportController.create)
    .put("/transport/:id", access.authMiddleware, access.permissionMiddleware('transports', 'update'), upload.single("img"), validate(transportUpdateSchema), transportController.put)
    .delete("/transport/:id", access.authMiddleware, access.permissionMiddleware('transports', 'delete'), transportController.delete)
export default router