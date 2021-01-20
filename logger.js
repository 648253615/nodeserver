const path = require('path')
const {
	createLogger,
	transports,
	format
} = require('winston')
const {
	combine,
	timestamp,
	errors,
	prettyPrint
} = format

module.exports = createLogger({
	format: combine(
		timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		errors({
			stack: true
		}),
		prettyPrint()
	),
	transports: [
		new transports.File({
			filename: path.join(__dirname, 'logger.log')
		})
	]
})
