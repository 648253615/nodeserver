const jwt = require('jsonwebtoken')
const config = require('../config')

class Auth {
	createToken(user) {
		const token = jwt.sign(user, config.secretKey, {
			expiresIn: config.jwtExpiresIn
		})
		return {
			token
		}
	}

	checkToken(req, res, next) {
		try {
			const token = req.headers.authorization
			req.user = jwt.verify(token, config.secretKey)
			next()
		} catch (err) {
			res.send({
				code: 1,
				message: '权限失效'
			})
		}
	}

	checkPermission(permissions) {
		return function(req, res, next) {
			const {
				role,
				permission
			} = req.user
			if (role.includes('admin') || permissions.some((v) => permission.includes(v))) {
				next()
			} else {
				res.send({
					code: 1,
					message: '暂无权限'
				})
			}
		}
	}
}

module.exports = new Auth()