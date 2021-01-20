const User = require('../models/user')

module.exports = new class Controller {
	async list(req, res) {
		try {
			const {
				keyword,
				limit = 10,
				skip = 0
			} = req.query
			const where = {}
			if (keyword) where.username = new RegExp(keyword, 'i')
			const count = await User.countDocuments(where)
			const users = await User.find(where, '-password').sort('-_id').limit(parseInt(limit)).skip(skip * limit)
			res.send({
				count,
				users,
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
			await User.create(create)
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
			const detail = await User.findById(id)
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
			await User.findByIdAndUpdate(id, update)
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
			await User.findByIdAndDelete(id)
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
