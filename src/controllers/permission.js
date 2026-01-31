import permissionService from "../services/permission.js";

class PermissionController {
    async addPermission(req, res, next) {
        try {
            const data = await permissionService.addPermission(req.body);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async deletePermission(req, res, next) {
        try {
            const data = await permissionService.deletePermission(req.body);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async changePermission(req, res, next) {
        try {
            const data = await permissionService.changePermission(req.body);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async allPermissions(req, res, next) {
        try {
            const data = await permissionService.allPermissions(req.params.staffId);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async ownPermissions(req, res, next) {
        try {
            const data = await permissionService.ownPermissions(req.user.id, req.user.role);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new PermissionController();
