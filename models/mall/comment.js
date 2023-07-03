const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	goods_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MallGoods',
		required: true
	},
	content: {
		type: String,
		required: true,
		trim: true
	},
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	create_date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('MallComment', Schema)