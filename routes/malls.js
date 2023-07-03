const express = require('express')
const router = express.Router()
const goods = require('../controllers/mall/goods')
const categories = require('../controllers/mall/categories')
const comments = require('../controllers/mall/comments')
const orders = require('../controllers/mall/orders')
const auth = require('../middleware/auth')

router.get('/categories', auth.checkToken, categories.list)
router.post('/categories', auth.checkToken, categories.create)
router.put('/categories/:id', auth.checkToken, categories.update)
router.delete('/categories/:id', auth.checkToken, categories.delete)

router.get('/comments', auth.checkToken, comments.list)
router.post('/comments', auth.checkToken, comments.create)
router.put('/comments/:id', auth.checkToken, comments.update)
router.delete('/comments/:id', auth.checkToken, comments.delete)

router.get('/goods', auth.checkToken, goods.list)
router.post('/goods', auth.checkToken, goods.create)
router.put('/goods/:id', auth.checkToken, goods.update)
router.delete('/goods/:id', auth.checkToken, goods.delete)

router.get('/orders', auth.checkToken, orders.list)
router.post('/orders', auth.checkToken, orders.create)
router.put('/orders/:id', auth.checkToken, orders.update)
router.delete('/orders/:id', auth.checkToken, orders.delete)

module.exports = router