const crypto = require('crypto')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		set: (v) => crypto.createHash('md5').update(v).digest('hex')
	},
	gender: {
		type: Number,
		enum: [0, 1, 2],
		default: 0
	},
	status: {
		type: Number,
		enum: [0, 1, 2, 3],
		default: 0
	},
	avatar: {
		type: String,
		trim: true
	},
	role: {
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

module.exports = mongoose.model('User', User)
