const Permission = require('../models/permission')

module.exports = new class Controller {
	async list(req, res) {
		try {
			const {
				keyword,
				limit = 10,
				skip = 0
			} = req.query
			const where = {}
			const count = await Permission.countDocuments(where)
			const permissions = await Permission.find(where).sort('-_id').limit(parseInt(limit)).skip(skip * limit)
			res.send({
				count,
				permissions,
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
			await Permission.create(create)
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
			const detail = await Permission.findById(id)
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
			await Permission.findByIdAndUpdate(id, update)
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
			await Permission.findByIdAndDelete(id)
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
