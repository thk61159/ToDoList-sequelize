const router = require('express').Router();
const { Todo } = require('../../models');
const { User } = require('../../models');

// 定義首頁路由
router.get('/', (req, res) => {
  res.locals.controller = '/todos/new';
  res.locals.sign = 'create';
  const UserId = req.user.id;
  Todo.findAll({
    where:{UserId},
    raw: true,
    nest: true,
  })
    .then((todos) => {
      return res.render('index', { todos: todos });
    })
    .catch((error) => {
      return res.status(422).json(error);
    });
  
});

module.exports = router;
