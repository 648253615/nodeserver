const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	desc: {
		type: String,
		trim: true
	},
	parent_id: {
		type: String,
		trim: true
	},
	create_date: {
		type: Date,
		default: Date.now
	},
	update_date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('MallCategory', Schema)