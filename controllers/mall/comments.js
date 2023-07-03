const MallComment = require('../../models/mall/comment')

class Api {
	async list(req, res) {
		try {
			const {
				limit,
				skip = 0,
				keyword
			} = req.query
			const where = {
				content: new RegExp(keyword, 'i')
			}
			const count = await MallComment.countDocuments(where)
			const comments = await MallComment.find(where)
				.populate('user_id', 'username avatar')
				.populate('goods_id', 'name thumbs')
				.sort('-create_date').skip(skip * limit).limit(parseInt(limit))
			res.send({
				code: 0,
				message: '评论查询成功',
				count,
				comments
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '评论查询失败'
			})
		}
	}

	async create(req, res) {
		try {
			const {
				goods_id,
				content,
				rating
			} = req.body
			await MallComment.create({
				goods_id,
				content,
				rating,
				user_id: req.user.uid
			})
			res.send({
				code: 0,
				message: '评论创建成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '评论创建失败'
			})
		}
	}

	async update(req, res) {
		try {
			const id = req.params.id
			const {
				content,
				rating,
				media
			} = req.body
			await MallComment.findByIdAndUpdate(id, {
				content,
				rating,
				media
			})
			res.send({
				code: 0,
				message: '评论更新成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '评论更新失败'
			})
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			await MallComment.findByIdAndDelete(id)
			res.send({
				code: 0,
				message: '评论删除成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '评论删除失败'
			})
		}
	}
}

module.exports = new Api()