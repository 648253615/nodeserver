const fs = require('fs')
const path = require('path')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

module.exports = new class Middleware {
	upload(req, res, next) {
		req.upload = multer({
			storage: multer.diskStorage({
				destination(req, file, cb) {
					const dir = path.join(__dirname, '../public/uploads')
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
		}).any()
		next()
	}

	checkToken(req, res, next) {
		const token = req.headers.authorization || req.session.token
		if (!token) return res.send({
			code: -1,
			message: 'TOKEN_INVALID'
		})
		jwt.verify(token, 'nodeserver', (err, decoded) => {
			if (err) return res.send({
				code: err.code,
				message: err.message
			})
			req.loginUser = decoded
			next()
		})
	}

	createToken(req, res, next) {
		req.createToken = (user) => {
			const tokenExpired = Date.now() + 7 * 86400000
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

	sendMail(req, res, next) {
		req.sendMail = async ({
			email = '648253615@qq.com',
			code = '123456',
			expMinute = '3'
		}) => {
			return await nodemailer.createTransport({
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
				text: `【LGS】验证码：${code}，${expMinute}分钟内有效，请勿泄露并尽快验证。`
			})
		}
		next()
	}
}
