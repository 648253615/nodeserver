const schedule = require('node-schedule')
const fs = require('fs')
const logger = require('./logger')
const File = require('./models/file')

schedule.scheduleJob('0 0 * * *', async function() {
	try {
		const files = await File.find({
			expires_date: {
				$lt: Date.now()
			}
		}, 'path')
		if (files.length) {
			const ids = []
			files.forEach(file => {
				ids.push(file._id)
				fs.existsSync(file.path) && fs.unlinkSync(file.path)
			})
			await File.deleteMany({
				_id: {
					$in: ids
				}
			})
			logger.info({
				files,
				name: '定时清理上传过期文件'
			})
		}
	} catch (err) {
		logger.error(err)
	}
})