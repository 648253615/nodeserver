const Permission = require('../models/permission')

class Api {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0,
				keyword
			} = req.query
			const where = {
				permission_name: new RegExp(keyword, 'i')
			}
			const count = await Permission.countDocuments(where)
			const permissions = await Permission.find(where).sort('permission_id')
				.skip(skip * limit).limit(parseInt(limit))
			res.send({
				code: 0,
				message: '权限查询成功',
				count,
				permissions
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '权限查询失败'
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
				code: 1,
				message: '权限创建失败'
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
				code: 1,
				message: '权限更新失败'
			})
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			await Permission.findByIdAndDelete(id)
			res.send({
				code: 0,
				message: '权限删除成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '权限删除失败'
			})
		}
	}
}

module.exports = new Api()