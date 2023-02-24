///////////////////////impot////////////////////////

const express = require('express')
const methodOverride = require('method-override')
const { engine } = require('express-handlebars')
const Handlebars = require('handlebars')
const routes = require('./routes')
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
const session = require('express-session')
const usePassport = require('./config/passport')
///////////////////////setting////////////////////////
const app = express()
const PORT = process.env.PORT || 3000
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs' }))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'hbs') //使用時省略寫副檔名
app.set('views', './views')
Handlebars.registerHelper('ifCond', function (a, b, options) {
	return a === b ? options.fn(this) : options.inverse(this)
})
app.use(methodOverride('_method')) //RESTful API for PUT and DELET

app.use(
	session({
		secret: 'ThisIsMySecret',
		resave: false,
		saveUninitialized: true,
	})
)
app.use(require('connect-flash')())
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
///////////////////////routes////////////////////////
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.warning_msg = req.flash('warning_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.isAuthenticated = req.isAuthenticated
	res.locals.user = req.user
	next()
})

app.use(routes)

app.listen(PORT, () => {
	console.log(`app is listening on http://localhost:${PORT}`)
})
