const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Permission = new Schema({
	permission_id: {
		type: String,
		required: true,
		unique: true,
		uppercase: true,
		trim: true
	},
	permission_name: {
		type: String,
		trim: true
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

module.exports = mongoose.model('Permission', Permission)
