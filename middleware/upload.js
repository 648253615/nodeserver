const multer = require('multer')
const path = require('path')
const fs = require('fs')
const File = require('../models/file')
const logger = require('../logger')
const config = require('../config')

class Upload {
	uploadFile(req, res, next) {
		multer({
			storage: multer.diskStorage({
				destination(req, file, cb) {
					const uploadPath = path.join(__dirname, `../uploads/${req.user.uid}`)
					fs.mkdirSync(uploadPath, {
						recursive: true
					})
					cb(null, uploadPath)
				},
				filename(req, file, cb) {
					const originalname = file.originalname
					const ext = originalname.slice(originalname.lastIndexOf('.'))
					cb(null, Date.now() + ext)
				}
			}),
			limits: {
				fileSize: config.upload.fileSize
			},
			fileFilter(req, file, cb) {
				cb(null, config.upload.fileType.includes(file.mimetype))
			}
		}).any()(req, res, function(err) {
			try {
				if (err) throw err
				const files = []
				req.files = req.files.map((file) => {
					const url = file.path.replace(file.destination + '\\',
						`//${req.headers.host}/uploads/${userId}/`)
					files.push(url)
					return {
						url,
						name: file.originalname,
						size: file.size,
						type: file.mimetype,
						path: file.path,
						expires_date: Date.now() + config.upload.fileExpiresIn
					}
				})
				File.create(req.files)
				res.send({
					files,
					code: 0,
					message: '上传文件成功'
				})
			} catch (err) {
				logger.error(err)
				res.send({
					code: 1,
					message: '上传文件失败'
				})
			}
		})
	}

	async updateFile(url, exp) {
		await File.updateMany({
			url
		}, {
			expires_date: exp
		})
	}
}

module.exports = new Upload()