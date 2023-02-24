const { Todo } = require('../models')

const todoController = {
	homePage: async (req, res, next) => {
		try {
			const UserId = req.user.id
			const todos = await Todo.findAll({
				where: { UserId },
				raw: true,
				nest: true,
			})
			return res.render('index', { todos })
		} catch (err) {
			return next(err)
			// return res.status(422).json(error)
		}
	},
	newPage: (req, res) => {
		return res.render('new')
	},
	detailPage: async (req, res, next) => {
		try {
			const { id } = req.params
			const todo = await Todo.findByPk(id)
			//如果在網址id後面加string會出現奇怪的事
			if (!todo) throw new Error('此todo不存在')
			return res.render('detail', { todo: todo.toJSON() })
		} catch (err) {
			return next(err)
			// return res.status(422).json(error)
		}
	},
	editPage: async (req, res, next) => {
		try {
			const { id } = req.params
			const todo = await Todo.findByPk(id)
			if (!todo) throw new Error('此todo不存在')
			return res.render('edit', { todo: todo.toJSON() })
		} catch (err) {
			return next(err)
			// return res.status(422).json(error)
		}
	},
	newTodo: async (req, res, next) => {
		try {
			const UserId = req.user.id;
      const { name } = req.body;
      if (!name.trim()) {
        throw new Error('無法新增空白todo')
      }
      await Todo.create({ name, UserId, isDone: false })
      return res.redirect('/')
		} catch (err) {
			return next(err)
			// return res.status(422).json(error)
		}
  },
  editTodo: async (req, res, next) => {
    try {
      const UserId = req.user.id;
      const { id } = req.params;
      const { name, isDone } = req.body;
      if (!name.trim()) {
				throw new Error('todo無法為空白')
      }
      const todo = await Todo.findOne({ where: { id, UserId } })
       if (!todo) throw new Error('無法修改不存在的todo')
      todo.name = name
      todo.isDone = isDone === 'on'
      await todo.save()
      return res.redirect('/')
    } catch (err) {
      return next(err)
      // return res.status(422).json(error)
    }
  },
  deleteTodo: async (req, res, next) => { 
    try {
      const UserId = req.user.id
      const { id } = req.params
      const todo = await Todo.findOne({ where: { id, UserId } })
      if(!todo) throw new Error('無法刪除不存在的todo')
      await todo.destroy()
      return res.redirect('/')
		} catch (err) {
			return next(err)
			// return res.status(422).json(error)
		}
  }
}

module.exports = todoController;
