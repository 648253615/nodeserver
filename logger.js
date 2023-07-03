const winston = require('winston')
const path = require('path')
require('winston-daily-rotate-file')

module.exports = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.errors({
			stack: true
		}),
		winston.format.prettyPrint()
	),
	transports: [
		new winston.transports.DailyRotateFile({
			dirname: path.join(__dirname, 'logs'),
			filename: 'winston.log.%DATE%',
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxFiles: '14d'
		})
	]
})