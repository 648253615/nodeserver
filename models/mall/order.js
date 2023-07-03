const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	status: {
		type: Number,
		enum: [0, 1, 2, 3, 4],
		default: 0
	},
	total_amount: {
		type: Number,
		required: true
	},
	payment_method: {
		type: String
	},
	payment_date: {
		type: Date
	},
	express_nu: {
		type: String
	},
	express_com: {
		type: String
	},
	express_date: {
		type: Date
	},
	shipping_addr: {
		type: String,
		required: true
	},
	items: [{
		sku_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'MallSku',
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
		quantity: {
			type: Number,
			required: true
		}
	}],
	create_date: {
		type: Date,
		default: Date.now
	},
	update_date: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model('MallOrder', Schema)