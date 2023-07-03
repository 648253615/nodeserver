const Menu = require('../models/menu')

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
			const count = await Menu.countDocuments(where)
			const menus = await Menu.find(where).sort('sort').skip(skip * limit).limit(parseInt(limit))
			res.send({
				count,
				menus,
				code: 0,
				message: '菜单查询成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '菜单查询失败'
			})
		}
	}

	async create(req, res) {
		try {
			const {
				menu_id,
				name,
				icon,
				url,
				sort,
				parent_id,
				permission,
				enable
			} = req.body
			await Menu.create({
				menu_id,
				name,
				icon,
				url,
				sort,
				parent_id,
				permission,
				enable
			})
			res.send({
				code: 0,
				message: '菜单创建成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '菜单创建失败'
			})
		}
	}

	async update(req, res) {
		try {
			const id = req.params.id
			const {
				menu_id,
				name,
				icon,
				url,
				sort,
				parent_id,
				permission,
				enable
			} = req.body
			await Menu.findByIdAndUpdate(id, {
				menu_id,
				name,
				icon,
				url,
				sort,
				parent_id,
				permission,
				enable
			})
			res.send({
				code: 0,
				message: '菜单更新成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '菜单更新失败'
			})
		}
	}

	async delete(req, res) {
		try {
			const id = req.params.id
			await Menu.findByIdAndDelete(id)
			res.send({
				code: 0,
				message: '菜单删除成功'
			})
		} catch (err) {
			res.send({
				code: 1,
				message: '菜单删除失败'
			})
		}
	}
}

module.exports = new Api()