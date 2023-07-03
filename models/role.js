const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	role_id: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	role_name: {
		type: String,
		required: true,
		trim: true
	},
	permission: {
		type: [String]
	},
	comment: {
		type: String,
		trim: true
	},
	create_date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Role', Schema)