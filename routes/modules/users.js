const router = require('express').Router();
const passport = require('passport'); //POST login authenticator
const bcrypt = require('bcryptjs'); //POST register hash password
const {User} = require('../../models');

router.get('/login', (req, res) => {
  const { note } = req.query;
  res.locals.hiddenLogoutBtn = true;
  res.render('login', { note });
});
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
);

router.get('/register', (req, res) => {
  res.locals.hiddenLogoutBtn = true;
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      console.log('User already exists');
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword,
      });
    }
    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash,
        })
      )
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err));
  });
});

router.get('/logout', (req, res) => {
  const note = '已登出';
  req.logout();
  res.redirect(`/users/login?note=${note}`);
});
module.exports = router;
