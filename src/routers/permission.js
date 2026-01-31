import { Router } from "express";
import permissionController from "../controllers/permission.js";
import access from "../access/access.js";
import { validate, addPermissionSchema, deletePermissionSchema, changePermissionSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/permission/own", access.authMiddleware, permissionController.ownPermissions)
    .get("/permission/:staffId", access.authMiddleware, access.permissionMiddleware('admins', 'read'), permissionController.allPermissions)
    .post("/permission", access.authMiddleware, access.permissionMiddleware('admins', 'create'), validate(addPermissionSchema), permissionController.addPermission)
    .put("/permission", access.authMiddleware, access.permissionMiddleware('admins', 'update'), validate(changePermissionSchema), permissionController.changePermission)
    .delete("/permission", access.authMiddleware, access.permissionMiddleware('admins', 'delete'), validate(deletePermissionSchema), permissionController.deletePermission)

export default router;
