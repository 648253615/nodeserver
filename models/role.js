const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Role = new Schema({
	role_id: {
		type: String,
		required: true,
		unique: true,
		uppercase: true,
		trim: true
	},
	role_name: {
		type: String,
		trim: true
	},
	permission: {
		type: [String]
	},
	comment: {
		type: String,
		trim: true
	},
	created_date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Role', Role)
