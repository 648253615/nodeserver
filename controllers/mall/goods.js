const mongoose = require('mongoose')
const MallGoods = require('../../models/mall/goods')
const MallSku = require('../../models/mall/sku')
const Upload = require('../../middleware/upload')

class Api {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0,
				keyword,
				category_id,
				status
			} = req.query
			const where = {
				name: new RegExp(keyword, 'i')
			}
			if (category_id || status) {
				where.$or = []
			}
			if (category_id) {
				where.$or.push({
					category_id
				})
			}
			if (status) {
				where.$or.push({
					status
				})
			}
			const count = await MallGoods.countDocuments(where)
			const goods = await MallGoods.aggregate([{
					$match: where
				},
				{
					$lookup: {
						from: "mallskus",
						localField: "_id",
						foreignField: "goods_id",
						as: "skus"
					}
				},
				{
					$addFields: {
						totalStock: {
							$sum: "$skus.stock"
						},
						lowestPrice: {
							$min: "$skus.price"
						}
					}
				},
				{
					$sort: {
						create_date: -1
					}
				},
				{
					$skip: skip * limit
				},
				{
					$limit: parseInt(limit)
				}
			])
			res.send({
				code: 0,
				message: '商品查询成功',
				count,
				goods
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '商品查询失败'
			})
		}
	}

	async create(req, res) {
		const session = await mongoose.startSession()
		session.startTransaction()
		try {
			const {
				category_id,
				name,
				desc,
				thumbs,
				banners,
				status,
				skus
			} = req.body
			const goods = await MallGoods.create({
				category_id,
				name,
				desc,
				thumbs,
				banners,
				status
			})
			await Upload.updateFile([...thumbs, ...banners], null)
			await Promise.all(skus.map(async sku => {
				sku.goods_id = goods._id
				return await MallSku.create(sku)
			}))
			await session.commitTransaction()
			res.send({
				code: 0,
				message: '商品创建成功'
			})
		} catch (err) {
			await session.abortTransaction()
			res.send({
				code: 1,
				message: '商品创建失败'
			})
		} finally {
			session.endSession()
		}
	}

	async update(req, res) {
		const session = await mongoose.startSession()
		session.startTransaction()
		try {
			const id = req.params.id
			const {
				category_id,
				name,
				desc,
				thumbs,
				banners,
				status,
				skus
			} = req.body
			const goods = await MallGoods.findByIdAndUpdate(id, {
				category_id,
				name,
				desc,
				thumbs,
				banners,
				status
			})
			goods.thumbs.filter(v => {
				if (!thumbs.includes(v)) {
					Upload.updateFile(v, Date.now())
				}
			})
			goods.banners.filter(v => {
				if (!banners.includes(v)) {
					Upload.updateFile(v, Date.now())
				}
			})
			thumbs.filter((v) => {
				if (!goods.thumbs.includes(v)) {
					Upload.updateFile(v, null)
				}
			})
			banners.filter((v) => {
				if (!goods.banners.includes(v)) {
					Upload.updateFile(v, null)
				}
			})
			const oldSkus = await MallSku.find({
				goods_id: id
			})
			await Promise.all(oldSkus.map(async sku => {
				const has = skus.filter(v => v._id === sku._id.toString()).length
				return !has ? await MallSku.findByIdAndDelete(sku._id) : true
			}))
			await Promise.all(skus.map(async sku => {
				if (sku._id) {
					return await MallSku.findByIdAndUpdate(sku._id, sku)
				} else {
					sku.goods_id = goods._id
					return await MallSku.create(sku)
				}
			}))
			await session.commitTransaction()
			res.send({
				code: 0,
				message: '商品更新成功'
			})
		} catch (err) {
			await session.abortTransaction()
			res.send({
				code: 1,
				message: '商品更新失败'
			})
		} finally {
			session.endSession()
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			const goods = await MallGoods.findByIdAndDelete(id)
			await Upload.updateFile([...goods.thumbs, ...goods.banners], Date.now())
			res.send({
				code: 0,
				message: '商品删除成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '商品删除失败'
			})
		}
	}
}

module.exports = new Api()