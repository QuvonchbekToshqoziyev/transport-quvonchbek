import branchService from "../services/branch.js";

class BranchController {

    async getAll(req, res, next) {
        try {
            const data = await branchService.getAll()
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async search(req, res, next) {
        try {
            const data = await branchService.search(req.query)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async getOne(req, res, next) {
        try {
            const data = await branchService.getOne(req.params.id)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const data = await branchService.create(req.body)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }   
    }

    async put(req, res, next) {
        try {
            const data = await branchService.put(req.params.id, req.body)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const data = await branchService.delete(req.params.id)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async allInfo(req, res, next) {
        try {
            const data = await branchService.allInfo(req.params.id)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }
}

export default new BranchController();