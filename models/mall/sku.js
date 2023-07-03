const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	goods_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'MallGoods',
		required: true
	},
	specs: {
		type: [{
			name: String,
			values: [String]
		}],
		required: true
	},
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	stock: {
		type: Number,
		required: true
	},
	create_date: {
		type: Date,
		default: Date.now
	},
	update_date: {
		type: Date
	}
})

module.exports = mongoose.model('MallSku', Schema)