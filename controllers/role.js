const Role = require('../models/role')

module.exports = new class Controller {
	async list(req, res) {
		try {
			const {
				keyword,
				limit = 10,
				skip = 0
			} = req.query
			const where = {}
			const count = await Role.countDocuments(where)
			const roles = await Role.find(where).sort('-_id').limit(parseInt(limit)).skip(skip * limit)
			res.send({
				count,
				roles,
				code: 0,
				message: ''
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	async create(req, res) {
		try {
			const create = req.body
			await Role.create(create)
			res.send({
				code: 0,
				message: '',
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	async detail(req, res) {
		try {
			const id = req.params.id
			const detail = await Role.findById(id)
			res.send({
				detail,
				code: 0,
				message: ''
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	async update(req, res) {
		try {
			const id = req.params.id
			const update = req.body
			await Role.findByIdAndUpdate(id, update)
			res.send({
				code: 0,
				message: '',
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	async remove(req, res) {
		try {
			const id = req.params.id
			await Role.findByIdAndDelete(id)
			res.send({
				code: 0,
				message: '',
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}
}
