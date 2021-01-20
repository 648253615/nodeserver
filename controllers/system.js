const path = require('path')
const User = require('../models/user')
const File = require('../models/file')

module.exports = new class Controller {
	async upload(req, res) {
		try {
			req.upload(req, res, (err) => {
				const files = []
				const dir = path.join(__dirname, '../public')
				req.files.map((file) => {
					files.push({
						name: file.originalname,
						size: file.size,
						type: file.mimetype,
						path: file.path,
						url: file.path.replace(dir, req.headers.origin),
						expires_date: Date.now() + 3 * 86400000
					})
				})
				File.create(files)
				res.send({
					files,
					code: 0,
					message: ''
				})
			})
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	async register(req, res) {
		try {
			const {
				username,
				password
			} = req.body
			const hasAdmin = await User.countDocuments({
				role: {
					$in: ['admin']
				}
			})
			if (hasAdmin) throw new Error('USER_INVALID')
			const user = await User.create({
				username,
				password,
				role: ['admin']
			})
			const auth = req.createToken(user.toJSON())
			const obj = {
				code: 0,
				message: '',
				uid: user._id,
				token: auth.token,
				tokenExpired: auth.tokenExpired
			}
			req.session.token = auth.token
			res.send(obj)
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
			const user = await User.findOne({
				username,
				password
			})
			if (!user) throw new Error('USER_INVALID')
			const auth = req.createToken(user.toJSON())
			const obj = {
				code: 0,
				message: '',
				uid: user._id,
				userInfo: user,
				token: auth.token,
				tokenExpired: auth.tokenExpired
			}
			req.session.token = auth.token
			res.send(obj)
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	async logout(req, res) {
		req.session.destroy()
		res.redirect('/')
	}
}
