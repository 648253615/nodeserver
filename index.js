const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const controllers = require('./controllers')
const mongoose = require('./models')
const logger = require('./logger')
const app = express()
require('./schedule')

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({
	extended: false
}))
app.use(cookieParser())
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'nodeserver',
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 86400
	})
}))

app.use('/', controllers)

app.use((err, req, res, next) => {
	logger.error(err)
	res.status(500).send(err.message)
})

app.listen(3000)
