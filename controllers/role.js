const Role = require('../models/role')

module.exports = new class Controller {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0
			} = req.query
			const count = await Role.countDocuments()
			const roles = await Role.find().sort('-_id').skip(skip * limit).limit(parseInt(limit))
			res.send({
				count,
				roles,
				code: 0,
				message: '角色查询成功'
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
			const {
				role_id,
				role_name,
				permission,
				comment
			} = req.body
			await Role.create({
				role_id,
				role_name,
				permission,
				comment
			})
			res.send({
				code: 0,
				message: '角色创建成功'
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
			const {
				role_name,
				permission,
				comment
			} = req.body
			await Role.findByIdAndUpdate(id, {
				role_name,
				permission,
				comment
			})
			res.send({
				code: 0,
				message: '角色更新成功'
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
				message: '角色删除成功'
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}
}
