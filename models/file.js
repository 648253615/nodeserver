const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	name: {
		type: String
	},
	size: {
		type: Number
	},
	type: {
		type: String
	},
	path: {
		type: String
	},
	url: {
		type: String
	},
	expires_date: {
		type: Date
	},
	created_date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('File', Schema)