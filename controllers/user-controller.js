const passport = require('passport') //POST login authenticator
const bcrypt = require('bcryptjs') //POST register hash password
const { User } = require('../models')

function checkData(name, email, password, confirmPassword, user) {
  try {
    if (!(name && email && password && confirmPassword)) throw new Error('每格都是必填')
    if (password !== confirmPassword) throw new Error('確認密碼與密碼不同')
    if (user) throw new Error('此信箱已被註冊')
  } catch (err) {
    throw new Error(err)
  }
}
const userController = {
	loginPage: (req, res) => {
		res.render('login')
	},
	login: (req, res, next) => {
		passport.authenticate('local', (err, user) => {
			if (err) return next(err)
			if (!user) return res.redirect('/users/login')
			req.logIn(user, err => {
				if (err) return next(err)
				return res.redirect('/')
			})
		})(req, res, next)
	},
	registerPage: (req, res) => {
		res.render('register')
	},
	register: async (req, res, next) => {
		try {
      const { name, email, password, confirmPassword } = req.body
      const user = await User.findOne({ where: { email } })
      checkData(name, email, password, confirmPassword, user)
			const salt = await bcrypt.genSalt(10)
			const hash = await bcrypt.hash(password, salt)
			await User.create({
				name,
				email,
				password: hash,
			})
			res.redirect('/')
		} catch (err) {
			return next(err)
		}
	},
	logout: (req, res) => {
		req.logout()
		res.redirect(`/users/login`)
	}
}

module.exports = userController
