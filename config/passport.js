const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const FacebookStrategy = require('passport-facebook').Strategy;
const {User} = require('../models');
const bcrypt = require('bcryptjs');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
//module.exports，直接匯出一個 function
module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ where: { email } }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'this email has not been registered',
          });
        }
        return bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            console.log(password, user.password);
            if (!isMatch) {
              return done(null, false, {
                message: 'Email or Password incorrect.',
              });
            }
            return done(null, user); //如果沒遇到錯誤則將user傳下去
          })
          .catch((err) => done(err, false));
      });
    })
  );
  // passport.use(
  //   new FacebookStrategy(
  //     {
  //       clientID: process.env.FACEBOOK_APP_ID,
  //       clientSecret: process.env.FACEBOOK_APP_SECRET,
  //       callbackURL: process.env.FACEBOOK_CALLBACK,
  //       profileFields: ['email', 'displayName'],
  //     },
  //     function (accessToken, refreshToken, profile, done) {
  //       const { name, email } = profile._json;
  //       User.findOne({where:{ email }})
  //         .then((user) => {
  //           if (user) return done(null, user);
  //           const randomPassword = Math.random().toString(36).slice(-8);
  //           bcrypt
  //             .genSalt(10)
  //             .then((salt) => bcrypt.hash(randomPassword, salt))
  //             .then((hash) =>
  //               User.create({
  //                 name,
  //                 email,
  //                 password: hash,
  //               }))
  //             .then((user) => done(null, user))
  //             .catch((e) => done(e, false));
  //         }
  //         )
  //     }));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON();
        done(null, user);
      })
      .catch((err) => done(err, null));
  });
};
