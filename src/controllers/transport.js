import transportService from "../services/transports.js";

class TransportController {

    async getAll(req, res, next) {
        try {
            const data = await transportService.getAll()
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async search(req, res, next) {
        try {
            const data = await transportService.search(req.query)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async getOne(req, res, next) {
        try {
            const data = await transportService.getOne(req.params.id)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async getByBranch(req, res, next) {
        try {
            const data = await transportService.getByBranch(req.params.branchId)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const body = { ...req.body };
            if (req.file) {
                body.img = req.file.filename;
            }
            if (req.branchScopeRequired) {
                body.branch = req.user.branch;
            }
            const data = await transportService.create(body);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async put(req, res, next) {
        try {
            const body = { ...req.body };
            if (req.file) {
                body.img = req.file.filename;
            }
            const branchFilter = req.branchScopeRequired ? req.user.branch : null;
            const data = await transportService.put(req.params.id, body, branchFilter);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const branchFilter = req.branchScopeRequired ? req.user.branch : null;
            const data = await transportService.delete(req.params.id, branchFilter);
            return res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new TransportController();