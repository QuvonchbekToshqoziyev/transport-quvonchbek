import { Router } from "express";
import permissionController from "../controllers/permission.js";
import { checkToken } from "../middleware/auth.js";
import { roleGuard } from "../middleware/authorize.js";
import { validate, addPermissionSchema, deletePermissionSchema, changePermissionSchema } from "../validation/validation.js";

const router = Router();

router
    .get("/permission/own", checkToken, permissionController.ownPermissions)
    .get("/permission/:staffId", checkToken, roleGuard(["branchmanager", "superadmin"]), permissionController.allPermissions)
    .post("/permission", checkToken, roleGuard(["branchmanager", "superadmin"]), validate(addPermissionSchema), permissionController.addPermission)
    .put("/permission", checkToken, roleGuard(["branchmanager", "superadmin"]), validate(changePermissionSchema), permissionController.changePermission)
    .delete("/permission", checkToken, roleGuard(["branchmanager", "superadmin"]), validate(deletePermissionSchema), permissionController.deletePermission)

export default router;
