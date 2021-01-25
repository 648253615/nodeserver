const fs = require('fs')
const path = require('path')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const File = require('../models/file')

module.exports = new class Middleware {
	uploadFile(req, res, next) {
		multer({
			storage: multer.diskStorage({
				destination(req, file, cb) {
					const dir = path.join(__dirname, '../public/files')
					fs.mkdirSync(dir, {
						recursive: true
					})
					cb(null, dir)
				}
			}),
			fileFilter(req, file, cb) {
				const types = ['image/jpeg', 'image/png']
				cb(null, types.includes(file.mimetype))
			},
			limits: {
				fileSize: '2MB'
			}
		}).any()(req, res, (err) => {
			try {
				if (err) throw err
				req.files = req.files.map((file) => ({
					name: file.originalname,
					size: file.size,
					type: file.mimetype,
					path: file.path,
					url: file.path.replace(file.destination + '\\', `//${req.headers.host}/files/`),
					expires_date: Date.now() + 3 * 86400000
				}))
				File.create(req.files)
				res.send({
					code: 0,
					message: '',
					files: req.files
				})
			} catch (err) {
				res.send({
					code: err.code,
					message: err.message
				})
			}
		})
	}

	updateFile(req, res, next) {
		req.updateFile = async (url, exp) => {
			await File.findOneAndUpdate({
				url
			}, {
				expires_date: exp
			})
		}
		next()
	}

	createToken(req, res, next) {
		req.createToken = (user) => {
			const tokenExpired = Date.now() + 3 * 86400000
			const token = jwt.sign(user, 'nodeserver', {
				expiresIn: tokenExpired
			})
			return {
				token,
				tokenExpired
			}
		}
		next()
	}

	checkToken(req, res, next) {
		try {
			const token = req.headers.authorization || req.session.token
			const decoded = jwt.verify(token, 'nodeserver')
			req.loginUser = decoded
			next()
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	hasAdmin(req, res, next) {
		try {
			if (!req.loginUser) throw new Error('令牌无效')
			const hasAdmin = req.loginUser.role.includes('ADMIN')
			if (!hasAdmin) throw new Error('管理员无效')
			next()
		} catch (err) {
			res.send({
				code: err.code,
				message: err.message
			})
		}
	}

	sendMail(req, res, next) {
		req.sendMail = async ({
			email,
			code
		}) => {
			req.session.code = code
			await nodemailer.createTransport({
				host: 'smtp.qq.com',
				port: 587,
				secure: false,
				auth: {
					user: '648253615@qq.com',
					pass: 'tqgsnsidewkgbeff'
				}
			}, {
				from: '648253615@qq.com'
			}).sendMail({
				to: email,
				subject: 'LGS丨验证码',
				text: `【LGS】验证码：${code}，当天有效，请勿泄露并尽快验证。`
			})
		}
		next()
	}
}
