const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	permission_id: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	permission_name: {
		type: String,
		required: true,
		trim: true
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

module.exports = mongoose.model('Permission', Schema)