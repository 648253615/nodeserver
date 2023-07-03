const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const mongoClient = require('./models')
const indexRouter = require('./routes/index')
const mallsRouter = require('./routes/malls')
const logger = require('./logger')
const config = require('./config')
const app = express()
require('./schedule')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
	extended: false
}))
app.use(cookieParser())
app.use(session({
	secret: config.secretKey,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		clientPromise: mongoClient,
		ttl: 86400
	})
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/', indexRouter)
app.use('/malls', mallsRouter)

app.use(function(req, res, next) {
	res.status(404).send('页面不存在')
})
app.use(function(err, req, res, next) {
	logger.error(err)
	res.status(500).send(err.message)
})
app.listen(config.port)