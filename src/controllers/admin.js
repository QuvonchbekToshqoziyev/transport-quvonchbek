import adminService from "../services/admin.js";

class AdminController {
    async getAll(req, res, next) {
        try {
            const data = await adminService.getAll()    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }
    
    async getOne(req, res, next) {
        try {
            const data = await adminService.getOne(req.params.id)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async getBranch(req, res, next) {
        try {
            const data = await adminService.getBranch(req.params.branch)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async promote(req, res, next) {
        try {
            const data = await adminService.promote(req.body)    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async promoteToBranchManager(req, res, next) {
        try {
            const data = await adminService.promoteToBranchManager(req.body)    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async demoteBranchManager(req, res, next) {
        try {
            const data = await adminService.demoteBranchManager(req.params.id)    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async put(req, res, next) {
        try {
            const data = await adminService.put(req.params.id, req.body)    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async demote(req, res, next) {
        try {
            const data = await adminService.demote(req.params.id)    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async getOwnPermissions(req, res, next) {
        try {
            const data = await adminService.getOwnPermissions(req.user.id, req.user.role)    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }
}

export default new AdminController();