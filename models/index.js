const mongoose = require('mongoose')
const logger = require('../logger')

mongoose.connect('mongodb://localhost/nodeserver', {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})

mongoose.connection.on('error', logger.error)

module.exports = mongoose
