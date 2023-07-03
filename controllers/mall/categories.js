const MallCategory = require('../../models/mall/category')

class Api {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0,
				keyword
			} = req.query
			const where = {
				name: new RegExp(keyword, 'i')
			}
			const count = await MallCategory.countDocuments(where)
			const categories = await MallCategory.find(where)
				.sort('name').skip(skip * limit).limit(parseInt(limit))
			res.send({
				code: 0,
				message: '分类查询成功',
				count,
				categories
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '分类查询失败'
			})
		}
	}

	async create(req, res) {
		try {
			const {
				name,
				desc,
				parent_id
			} = req.body
			await MallCategory.create({
				name,
				desc,
				parent_id
			})
			res.send({
				code: 0,
				message: '分类创建成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '分类创建失败'
			})
		}
	}

	async update(req, res) {
		try {
			const id = req.params.id
			const {
				name,
				desc,
				parent_id
			} = req.body
			await MallCategory.findByIdAndUpdate(id, {
				name,
				desc,
				parent_id,
				update_date: Date.now()
			})
			res.send({
				code: 0,
				message: '分类更新成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '分类更新失败'
			})
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			await MallCategory.findByIdAndDelete(id)
			res.send({
				code: 0,
				message: '分类删除成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '分类删除失败'
			})
		}
	}
}

module.exports = new Api()