const express = require('express')
const middleware = require('./middleware')
const system = require('./system')
const user = require('./user')
const role = require('./role')
const permission = require('./permission')
const router = express.Router()

router.post('/register', system.register)
router.post('/login', middleware.createToken, system.login)
router.post('/logout', middleware.checkToken, system.logout)
router.post('/upload', middleware.checkToken, middleware.uploadFile)

router.get('/users', middleware.checkToken, middleware.hasAdmin, user.list)
router.post('/users', middleware.checkToken, middleware.hasAdmin, user.create)
router.get('/users/:id', middleware.checkToken, middleware.hasAdmin, user.detail)
router.put('/users/:id', middleware.checkToken, middleware.hasAdmin, middleware.updateFile, user.update)
router.delete('/users/:id', middleware.checkToken, middleware.hasAdmin, middleware.updateFile, user.remove)

router.get('/roles', middleware.checkToken, middleware.hasAdmin, role.list)
router.post('/roles', middleware.checkToken, middleware.hasAdmin, role.create)
router.put('/roles/:id', middleware.checkToken, middleware.hasAdmin, role.update)
router.delete('/roles/:id', middleware.checkToken, middleware.hasAdmin, role.remove)

router.get('/permissions', middleware.checkToken, middleware.hasAdmin, permission.list)
router.post('/permissions', middleware.checkToken, middleware.hasAdmin, permission.create)
router.put('/permissions/:id', middleware.checkToken, middleware.hasAdmin, permission.update)
router.delete('/permissions/:id', middleware.checkToken, middleware.hasAdmin, permission.remove)

module.exports = router
