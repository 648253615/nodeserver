const express = require('express')
const router = express.Router()
const users = require('../controllers/users')
const roles = require('../controllers/roles')
const permissions = require('../controllers/permissions')
const menus = require('../controllers/menus')
const auth = require('../middleware/auth')
const upload = require('../middleware/upload')

router.post('/login', users.login)
router.get('/logout', users.logout)
router.get('/userinfo', auth.checkToken, users.detail)
router.post('/upload', auth.checkToken, upload.uploadFile)

router.get('/users', auth.checkToken, auth.checkPermission(['user_r']), users.list)
router.post('/users', auth.checkToken, auth.checkPermission(['user_c']), users.create)
router.put('/users/:id', auth.checkToken, auth.checkPermission(['user_u']), users.update)
router.delete('/users/:id', auth.checkToken, auth.checkPermission(['user_d']), users.delete)

router.get('/roles', auth.checkToken, roles.list)
router.post('/roles', auth.checkToken, auth.checkPermission(['role_c']), roles.create)
router.put('/roles/:id', auth.checkToken, auth.checkPermission(['role_u']), roles.update)
router.delete('/roles/:id', auth.checkToken, auth.checkPermission(['role_d']), roles.delete)

router.get('/permissions', auth.checkToken, permissions.list)
router.post('/permissions', auth.checkToken, auth.checkPermission(['permission_c']), permissions.create)
router.put('/permissions/:id', auth.checkToken, auth.checkPermission(['permission_u']), permissions.update)
router.delete('/permissions/:id', auth.checkToken, auth.checkPermission(['permission_d']), permissions.delete)

router.get('/menus', auth.checkToken, menus.list)
router.post('/menus', auth.checkToken, auth.checkPermission(['menu_c']), menus.create)
router.put('/menus/:id', auth.checkToken, auth.checkPermission(['menu_u']), menus.update)
router.delete('/menus/:id', auth.checkToken, auth.checkPermission(['menu_d']), menus.delete)

module.exports = router