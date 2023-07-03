const crypto = require('crypto')
const mongoose = require('mongoose')

const Schema  = new mongoose.Schema({
	avatar: {
		type: String,
		trim: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true,
		set: v => crypto.createHash('md5').update(v).digest('hex')
	},
	gender: {
		type: Number,
		enum: [0, 1, 2],
		default: 0
	},
	role: {
		type: [String]
	},
	status: {
		type: Number,
		enum: [0, 1],
		default: 0
	},
	create_date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('User', Schema)