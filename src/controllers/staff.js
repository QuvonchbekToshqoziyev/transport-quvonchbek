import staffService from "../services/staff.js";

class StaffController {

    async getMe(req, res, next) {
        try {
            const data = await staffService.getMe(req.user.id)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const branchFilter = req.branchScopeRequired ? req.user.branch : null;
            const data = await staffService.getAll(branchFilter);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            const branchFilter = req.branchScopeRequired ? req.user.branch : null;
            const data = await staffService.search(req.query, branchFilter);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async getOne(req, res, next) {
        try {
            const branchFilter = req.branchScopeRequired ? req.user.branch : null;
            const data = await staffService.getOne(req.params.id, branchFilter);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            if (req.branchScopeRequired) {
                req.body.branch = req.user.branch;
            }
            const data = await staffService.create(req.body);    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async put(req, res, next) {
        try {
            const branchFilter = req.branchScopeRequired ? req.user.branch : null;
            const data = await staffService.put(req.params.id, req.body, branchFilter);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const branchFilter = req.branchScopeRequired ? req.user.branch : null;
            const data = await staffService.delete(req.params.id, branchFilter);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new StaffController();