const nodemailer = require('nodemailer')
const config = require('../config')

class Mailer {
	async sendMailCode(email, code) {
		req.session.code = code
		await nodemailer.createTransport(config.mail, {
			from: config.mail.auth.user
		}).sendMail({
			to: email,
			subject: 'LGS丨验证码',
			text: `【LGS】验证码：${code}，当天有效，请勿泄露并尽快验证。`
		})
	}
}

module.exports = new Mailer()