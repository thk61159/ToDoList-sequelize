///////////////////////impot////////////////////////
const router = require('express').Router()
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth') 
const userController = require('../controllers/user-controller')
const todoController = require('../controllers/todo-controller')
///////////////////////router setting////////////////////////

router.get('/users/login', userController.loginPage)
router.post('/users/login', userController.login)
router.get('/users/register', userController.registerPage)
router.post('/users/register', userController.register)
router.get('/users/logout', userController.logout)
router.use('/auth', auth);
router.use('/', authenticator)

router.get('/todos/new', todoController.newPage)
router.post('/todos/new', todoController.newTodo)
router.get('/todos/:id/edit', todoController.editPage)
router.put('/todos/:id', todoController.editTodo)
router.delete('/todos/:id', todoController.deleteTodo)
router.get('/todos/:id', todoController.detailPage)
router.get('/', todoController.homePage)


//error handler
router.use('/', (err, req, res, next) => {
	if (err instanceof Error) {
		req.flash('error_msg', `${err.name}: ${err.message}`)
	} else {
		req.flash('error_msg', `${err}`)
	}
	res.redirect('back')
	next(err)
}) 
router.get('/*',(req,res)=>{res.redirect('/')})

module.exports = router
