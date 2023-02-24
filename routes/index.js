///////////////////////impot////////////////////////
const router = require('express').Router()
const home = require('./modules/home')
const todos = require('./modules/todos')

const { authenticator } = require('../middleware/auth') // 掛載 middleware
const { backbtn } = require('../middleware/backbtn')
const userController = require('../controllers/user-controller')
///////////////////////router setting////////////////////////
router.use('/todos', authenticator, backbtn, todos) // 加入驗證程序
router.get('/users/login', userController.loginPage)
router.post('/users/login', userController.login)
router.get('/users/register', userController.registerPage)
router.post('/users/register', userController.register)

// router.use('/auth', auth);
router.use('/', authenticator, home) // 加入驗證程序
router.use('/', (err, req, res, next) => {
	if (err instanceof Error) {
		console.log(err)
		req.flash('error_msg', `${err.name}: ${err.message}`)
	} else {
		req.flash('error_msg', `${err}`)
	}
	res.redirect('back')
	next(err)
}) // 加入驗證程序

module.exports = router
