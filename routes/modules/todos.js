const router = require('express').Router();
const { Todo } = require('../../models');
const { User } = require('../../models');

//creat route
router.get('/new', (req, res) => {
  res.render('new');
});
//read route
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Todo.findByPk(id)
    .then((todo) => res.render('detail', { todo: todo.toJSON() }))
    .catch((error) => console.log(error));
});
router.get('/:id/edit', (req, res) => {
  const { id } = req.params;
  return Todo.findByPk(id)
    .then((todo) => res.render('edit', { todo: todo.toJSON() }))
    .catch((error) => console.log(error));
});
//create route
router.post('/new', (req, res) => {
  const UserId = req.user.id;
  const { name } = req.body;
  if (name.trim()) {
    Todo.create({ name, UserId, isDone: false })
      .then(() => res.redirect('/'))
      .catch((error) => console.error(error));
  } else {
    let note = '無法新增空白todo';
    res.render('new', { note });
  }
});
//update route
router.put('/:id', (req, res) => {
  const UserId = req.user.id;
  const { id } = req.params;
  const { name, isDone } = req.body;
  return Todo.findOne({where:{ id, UserId }})
    .then((todo) => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/`))
    .catch((error) => console.error(error));
});
//delete route
router.delete('/:id', (req, res) => {
  const UserId = req.user.id;
  const {id} = req.params;
  return Todo.findOne({ where: { id, UserId } })
    .then((todo) => todo.destroy())
    .then(() => res.redirect(`/`))
    .catch((error) => console.error(error));
});
module.exports = router;
