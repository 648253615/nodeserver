const User = require('../models/user')
const Role = require('../models/role')
const File = require('../models/file')
const Permission = require('../models/permission')

module.exports = new class Controller {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0
			} = req.query
			const count = await User.countDocuments()
			const users = await User.find({}, '-password').sort('-_id').skip(skip * limit).limit(parseInt(limit))
			res.send({
				count,
				users,
				code: 0,
				message: '用户查询成功'
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
			const user = (await User.findById(id, '-password')).toJSON()
			const role = await Role.find({
				role_id: {
					$in: user.role
				}
			}, 'permission')
			user.permissions = role.reduce((y, x) => x.permission.concat(y.permission))
			res.send({
				user,
				code: 0,
				message: '用户查询成功'
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
				username,
				password,
				avatar,
				gender,
				status,
				role,
				comment
			} = req.body
			await User.create({
				username,
				password,
				avatar,
				gender,
				status,
				role,
				comment
			})
			res.send({
				code: 0,
				message: '用户创建成功'
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
				avatar,
				gender,
				status,
				role,
				comment,
				password
			} = req.body
			const user = await User.findByIdAndUpdate(id, {
				avatar,
				gender,
				status,
				role,
				comment,
				[password ? 'password' : '']: password
			})
			req.updateFile(avatar, null)
			if (user && user.avatar !== avatar) req.updateFile(user.avatar, Date.now())
			res.send({
				code: 0,
				message: '用户更新成功'
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
			const user = await User.findByIdAndDelete(id)
			if (user && user.avatar) req.updateFile(user.avatar, Date.now())
			res.send({
				code: 0,
				message: '用户删除成功'
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}
}
