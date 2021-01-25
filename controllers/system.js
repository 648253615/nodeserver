const path = require('path')
const User = require('../models/user')
const Role = require('../models/role')

module.exports = new class Controller {
	async register(req, res) {
		try {
			const {
				username,
				password
			} = req.body
			const hasAdmin = await User.countDocuments({
				role: {
					$in: ['ADMIN']
				}
			})
			await User.create({
				username,
				password,
				role: [hasAdmin ? 'USER' : 'ADMIN']
			})
			res.send({
				code: 0,
				message: '注册成功'
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	async login(req, res, next) {
		try {
			const {
				username,
				password
			} = req.body
			const user = (await User.findOne({
				username,
				password
			}, '-password')).toJSON()

			if (!user) throw new Error('USER_INVALID')
			const role = await Role.find({
				role_id: {
					$in: user.role
				}
			}, 'permission')
			if (role.length) user.permissions = role.reduce((x, y) => y.permission.concat(x.permission))
			const auth = req.createToken(user)
			req.session.token = auth.token
			res.send({
				code: 0,
				message: '登陆成功',
				userInfo: user,
				token: auth.token,
				tokenExpired: auth.tokenExpired
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
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
}
