const User = require('../models/user')
const Role = require('../models/role')
const Menu = require('../models/menu')
const File = require('../models/file')
const Auth = require('../middleware/auth')
const Upload = require('../middleware/upload')

class Api {
	async login(req, res) {
		try {
			const {
				username,
				password
			} = req.body
			let user = await User.findOne({
				username,
				password
			}, '-password')
			if (!user) {
				throw new Error('帐号不存在')
			}
			const roles = await Role.find({
				role_id: {
					$in: user.role
				}
			}, 'permission')
			user = user.toJSON()
			const permissions = new Set()
			roles.forEach(item => item.permission.forEach(v => permissions.add(v)))
			user.permission = [...permissions]
			const auth = Auth.createToken({
				uid: user._id,
				role: user.role,
				permission: user.permission
			})
			res.send({
				uid: user._id,
				token: auth.token,
				tokenExpired: auth.expiresIn,
				code: 0,
				message: '登陆成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '登陆失败'
			})
		}
	}

	async logout(req, res) {
		req.session.destroy()
		res.send({
			code: 0,
			message: '注销成功'
		})
	}

	async detail(req, res) {
		try {
			const id = req.user.uid
			let user = await User.findById(id, '-password')
			if (!user) {
				throw new Error('帐号不存在')
			}
			const roles = await Role.find({
				role_id: {
					$in: user.role
				}
			}, 'permission')
			user = user.toJSON()
			const permissions = new Set()
			roles.forEach(item => item.permission.forEach(v => permissions.add(v)))
			user.permission = [...permissions]
			const menus = await Menu.find()
			res.send({
				user,
				menus,
				code: 0,
				message: '用户查询成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '用户查询失败'
			})
		}
	}

	async list(req, res) {
		try {
			const {
				limit,
				skip = 0,
				keyword,
				sort,
				role,
				status
			} = req.query
			const where = {
				username: new RegExp(keyword, 'i')
			}
			if (role || status) {
				where.$or = []
			}
			if (role) {
				where.$or.push({
					role
				})
			}
			if (status) {
				where.$or.push({
					status
				})
			}
			const count = await User.countDocuments(where)
			const users = await User.find(where, '-password').sort(sort).skip(skip * limit).limit(parseInt(limit))
			res.send({
				users,
				count,
				code: 0,
				message: '用户查询成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '用户查询失败'
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
				role,
				status
			} = req.body
			await User.create({
				username,
				password,
				avatar,
				gender,
				role,
				status
			})
			if (avatar) {
				Upload.updateFile(avatar, null)
			}
			res.send({
				code: 0,
				message: '用户创建成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '用户创建失败'
			})
		}
	}

	async update(req, res) {
		try {
			const id = req.params.id
			const {
				avatar,
				gender,
				role,
				status,
				password
			} = req.body
			const updateData = {
				avatar,
				gender,
				role,
				status
			}
			if (password) {
				updateData.password = password
			}
			const user = await User.findByIdAndUpdate(id, updateData)
			if (avatar) {
				Upload.updateFile(avatar, null)
			}
			if (user && user.avatar !== avatar) {
				Upload.updateFile(user.avatar, Date.now())
			}
			res.send({
				code: 0,
				message: '用户更新成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '用户更新失败'
			})
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			const user = await User.findByIdAndDelete(id)
			if (user && user.avatar) {
				Upload.updateFile(user.avatar, Date.now())
			}
			res.send({
				code: 0,
				message: '用户删除成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '用户删除失败'
			})
		}
	}
}

module.exports = new Api()