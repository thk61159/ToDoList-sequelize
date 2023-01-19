//////////////////////////////////////////////////
const express = require('express')
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const { engine } = require('express-handlebars')
//////////////////////////////////////////////////
const app = express();
const PORT = 3000;
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.get('/', (req, res) => {
  res.send('hello world');
});
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
