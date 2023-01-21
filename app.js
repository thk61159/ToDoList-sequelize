///////////////////////impot////////////////////////

const express = require('express');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const routes = require('./routes');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const session = require('express-session');
const usePassport = require('./config/passport');
///////////////////////setting////////////////////////
const app = express();
const PORT = process.env.PORT || 3000;
app.engine('hbs', engine({ defaultLayout: 'main', extname: 'hbs' }));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs'); //使用時省略寫副檔名
app.set('views', './views');
app.use(methodOverride('_method')); //RESTful API for PUT and DELET
app.use(express.static('public'));
app.use(
  session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true,
  })
);

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app);
///////////////////////routes////////////////////////
app.use((req, res, next) => {
  console.log(req,'??')
  res.locals.isAuthenticated = req.isAuthenticated;
  res.locals.user = req.user;
  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
});
