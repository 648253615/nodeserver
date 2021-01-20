const fs = require('fs')
const schedule = require('node-schedule')
const logger = require('./logger')
const File = require('./models/file')

schedule.scheduleJob('0 0 1 * * ?', async () => {
	try {
		const files = await File.find({
			expires_date: {
				$lt: Date.now()
			}
		})
		const ids = []
		files.map((file) => {
			ids.push(file._id)
			fs.existsSync(file.path) && fs.unlinkSync(file.path)
		})
		await File.deleteMany({
			_id: {
				$in: ids
			}
		})
	} catch (err) {
		logger.error(err)
	}
})
