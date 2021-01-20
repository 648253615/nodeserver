const express = require('express')
const router = express.Router()
const middleware = require('./middleware')
const system = require('./system')
const user = require('./user')
const role = require('./role')
const permission = require('./permission')

router.post('/upload', middleware.upload, system.upload)
router.post('/register', middleware.createToken, system.register)
router.post('/login', middleware.createToken, system.login)
router.post('/logout', system.logout)

router.get('/users', middleware.checkToken, user.list)
router.post('/users', middleware.checkToken, user.create)
router.get('/users/:id', middleware.checkToken, user.detail)
router.put('/users/:id', middleware.checkToken, user.update)
router.delete('/users/:id', middleware.checkToken, user.remove)

router.get('/roles', middleware.checkToken, role.list)
router.post('/roles', middleware.checkToken, role.create)
router.get('/roles/:id', middleware.checkToken, role.detail)
router.put('/roles/:id', middleware.checkToken, role.update)
router.delete('/roles/:id', middleware.checkToken, role.remove)

router.get('/permissions', middleware.checkToken, permission.list)
router.post('/permissions', middleware.checkToken, permission.create)
router.get('/permissions/:id', middleware.checkToken, permission.detail)
router.put('/permissions/:id', middleware.checkToken, permission.update)
router.delete('/permissions/:id', middleware.checkToken, permission.remove)

module.exports = router
