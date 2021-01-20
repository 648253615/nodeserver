module.exports = {
	apps: [{
		name: 'nodeserver',
		script: 'index.js',
		watch: false,
		env: {
			NODE_ENV: 'development'
		},
		env_production: {
			NODE_ENV: 'production'
		}
	}],
	deploy: {
		production: {
			user: 'root',
			host: '172.81.254.177',
			ref: 'origin/master',
			repo: 'git@github.com:648253615/nodeserver.git',
			path: '/home/nodeserver',
			'ssh_options': 'StrictHostKeyChecking=no',
			'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
		}
	}
}
