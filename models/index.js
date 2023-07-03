const mongoose = require('mongoose')
const logger = require('../logger')
const config = require('../config')

const client = mongoose.connect(config.databaseUrl).then(
	m => m.connection.getClient(),
	err => {
		logger.error(err)
	}
)

module.exports = client