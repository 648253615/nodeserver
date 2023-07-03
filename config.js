module.exports = {
	port: 3000,
	databaseUrl: 'mongodb://localhost:27017/nodeserver',
	secretKey: 'nodeserver',
	jwtExpiresIn: 86400,
	mail: {
		host: 'smtp.qq.com',
		port: 587,
		secure: false,
		auth: {
			user: 'your-email@example.com',
			pass: 'your-password'
		}
	},
	upload: {
		fileSize: 1024 * 1024,
		fileType: ['image/jpeg', 'image/png'],
		fileExpiresIn: 86400000,
	}
}