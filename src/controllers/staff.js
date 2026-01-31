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
            const data = await staffService.getAll()
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async search(req, res, next) {
        try {
            const data = await staffService.search(req.query)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async getOne(req, res, next) {
        try {
            const data = await staffService.getOne(req.params.id)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const data = await staffService.create(req.body)    
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async put(req, res, next) {
        try {
            const data = await staffService.put(req.params.id, req.body)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const data = await staffService.delete(req.params.id)
            return res.status(data.status).json(data);
        } catch (error) {
            next(error)
        }
    }
}

export default new StaffController();