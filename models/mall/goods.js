const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	category_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MallCategory',
		required: true
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	desc: {
		type: String,
		trim: true
	},
	thumbs: {
		type: [String]
	},
	banners: {
		type: [String]
	},
	sales: {
		type: Number,
		default: 0
	},
	status: {
		type: Number,
		enum: [0, 1, 2],
		default: 0
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

module.exports = mongoose.model('MallGoods', Schema)