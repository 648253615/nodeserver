const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	menu_id: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	icon: {
		type: String,
		trim: true
	},
	url: {
		type: String,
		trim: true
	},
	sort: {
		type: Number
	},
	parent_id: {
		type: String,
		trim: true
	},
	permission: {
		type: [String]
	},
	enable: {
		type: Boolean,
		default: true
	},
	create_date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('Menu', Schema)