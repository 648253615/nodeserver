const mongoose = require('mongoose')
const MallOrder = require('../../models/mall/order')
const MallGoods = require('../../models/mall/goods')
const MallSku = require('../../models/mall/sku')

class Api {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0,
				keyword,
				user_id,
				goods_id,
				status
			} = req.query
			const where = {}
			if (keyword) {
				where._id = keyword
			}
			if (user_id || goods_id || status) {
				where.$or = []
			}
			if (user_id) {
				where.$or.push({
					user_id
				})
			}
			if (goods_id) {
				where.$or.push({
					'items.sku_id.goods_id': goods_id
				})
			}
			if (status) {
				where.$or.push({
					status
				})
			}
			const count = await MallOrder.countDocuments(where)
			const orders = await MallOrder.find(where)
				.populate('user_id', 'username avatar')
				.populate({
					path: 'items.sku_id',
					populate: {
						path: 'goods_id',
						select: 'name thumbs'
					},
					select: 'goods_id'
				})
				.sort('-create_date').skip(skip * limit).limit(parseInt(limit))
			res.send({
				code: 0,
				message: '订单查询成功',
				count,
				orders
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '订单查询失败'
			})
		}
	}

	async create(req, res) {
		const session = await mongoose.startSession()
		session.startTransaction()
		try {
			const {
				list,
				shipping_addr
			} = req.body
			let total_amount = 0
			const newSales = {}
			const items = await Promise.all(list.map(async item => {
				const sku = await MallSku.findById(item.skuId).populate('goods_id', 'name')
				total_amount += sku.price * item.quantity
				if (newSales[sku.goods_id._id]) {
					newSales[sku.goods_id._id] += item.quantity
				} else {
					newSales[sku.goods_id._id] = item.quantity
				}
				sku.stock -= item.quantity
				await sku.save()
				return {
					sku_id: sku._id,
					name: sku.name,
					price: sku.price,
					quantity: item.quantity
				}
			}))
			Object.entries(newSales).forEach(async ([id, sales]) => {
				const goods = await MallGoods.findById(id)
				goods.sales += sales
				return await goods.save()
			})
			await MallOrder.create({
				items,
				total_amount,
				shipping_addr,
				user_id: req.user.uid,
				status: 0
			})
			await session.commitTransaction()
			res.send({
				code: 0,
				message: '订单创建成功'
			})
		} catch (err) {
			await session.abortTransaction()
			res.send({
				code: 1,
				message: '订单创建失败'
			})
		} finally {
			session.endSession()
		}
	}

	async update(req, res) {
		try {
			const id = req.params.id
			const {
				status,
				payment_method,
				express_nu,
				express_com
			} = req.body
			const order = await MallOrder.findById(id)
			order.update_date = Date.now()
			if (order.status === 0) {
				order.payment_method = payment_method
				order.payment_date = order.update_date
				order.status = 1
			} else if (order.status === 1) {
				order.express_nu = express_nu
				order.express_com = express_com
				order.express_date = order.update_date
				order.status = 2
			} else if (order.status === 2) {
				order.status = 3
			} else {
				order.status = status
			}
			await MallOrder.findByIdAndUpdate(id, order)
			res.send({
				code: 0,
				message: '订单更新成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '订单更新失败'
			})
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			await MallOrder.findByIdAndDelete(id)
			res.send({
				code: 0,
				message: '订单删除成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '订单删除失败'
			})
		}
	}
}

module.exports = new Api()