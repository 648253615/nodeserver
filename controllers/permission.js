const Permission = require('../models/permission')

module.exports = new class Controller {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0
			} = req.query
			const count = await Permission.countDocuments()
			const permissions = await Permission.find().sort('-_id').skip(skip * limit).limit(parseInt(limit))
			res.send({
				count,
				permissions,
				code: 0,
				message: '权限查询成功'
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
				permission_id,
				permission_name,
				comment
			} = req.body
			await Permission.create({
				permission_id,
				permission_name,
				comment
			})
			res.send({
				code: 0,
				message: '权限创建成功'
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
				permission_name,
				comment
			} = req.body
			await Permission.findByIdAndUpdate(id, {
				permission_name,
				comment
			})
			res.send({
				code: 0,
				message: '权限更新成功'
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
				message: '权限删除成功'
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}
}
