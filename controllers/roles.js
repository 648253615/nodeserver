const Role = require('../models/role')

class Api {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0,
				keyword
			} = req.query
			const where = {
				role_name: new RegExp(keyword, 'i')
			}
			const count = await Role.countDocuments(where)
			const roles = await Role.find(where).sort('role_id').skip(skip * limit).limit(parseInt(limit))
			res.send({
				count,
				roles,
				code: 0,
				message: '角色查询成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '角色查询失败'
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
				code: 1,
				message: '角色创建失败'
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
				code: 1,
				message: '角色更新失败'
			})
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			await Role.findByIdAndDelete(id)
			res.send({
				code: 0,
				message: '角色删除成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '角色删除失败'
			})
		}
	}
}

module.exports = new Api()