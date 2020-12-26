const express = require('express')
const router = express.Router()
const db = require('./models/db')

const userController = require('./controllers/user')
const topicsController = require('./controllers/topics')
const commentsController = require('./controllers/comments')
const sessionController = require('./controllers/session')

// 判断登陆权限
function checkLogin(req, res, next) {
	try {
		const {user} = req.session
		if (!user) {
			return res.status(401).json({
				error: 'Unau..'
			})
		}
		next()
	} catch (err) {
		next(err)
	}
}

// 判断话题,是否存在和匹配id
async function checkTopic(req, res, next) {
	try {
		// 1.获取参数
		const [topic] = await db.query(`SELECT * FROM topics WHERE id='${req.params.id}'`)
		
		// 2.判断
		if (!topic) {
			return res.status(404).json({
				error: 'Topic Not found'
			})
		}
		if (topic.user_id !== req.session.user.id) {
			return res.status(400).json({
				error: 'Topic Error'
			})
		}

		// 3.通过
		next()
	} catch (err) {
		next(err)
	}

}

// 判断用户,是否存在和匹配id 
async function checkUser(req, res, next) {
	try {
		// 1.获取参数
		const {id} = req.params
		const [user] = await db.query(`SELECT * FROM users WHERE id='${id}'`)

		// 2.判断
		if (!user) {
			return res.status(404).json({
				error: 'User Not fount'
			})
		}
		if (parseInt(id) !== req.session.user.id) {
			return res.status(400).json({
				error: 'User Error'
			})
		}

		// 3.通过
		next()
	} catch (err) {
		next(err)
	}
}

async function checkComment(req, res, next) {
	try {
		// 1.获取参数
		const {id} = req.params
		const [comment] = await db.query(`SELECT * FROM comments WHERE id='${id}'`)
		
		// 2.判断
		if (!comment) {
			return res.status(404).json({
				error: 'Comment Not found.'
			})
		}
		if (comment.user_id !== req.session.user.id) {
			return res.status(400).json({
				error: 'Comment Error.'
			})
		}

		// 3.通过
		next()
	} catch (err) {
		next(err)
	}
}

// 用戶模块 users
router
.get('/users', userController.get)
.get('/users/:id', userController.getOne)
.post('/users', userController.post)
.patch('/users/:id',checkLogin, checkUser, userController.patch)
.delete('/users/:id',checkLogin, checkUser, userController.delete)

// 话题模块 topics
router
.get('/topics', topicsController.getList)
.get('/topics/:id', topicsController.getOne)
.post('/topics', checkLogin, topicsController.post)
.patch('/topics/:id', checkLogin, checkTopic, topicsController.patch)
.delete('/topics/:id', checkLogin, checkTopic, topicsController.delete)

// 评论模块 comments
router
// .get('/comments', commentsController.get)
.get('/comments', commentsController.getSome)
.post('/comments', checkLogin, commentsController.post)
.patch('/comments/:id', checkLogin, commentsController.patch)
.delete('/comments/:id', checkLogin, checkComment, commentsController.delete)

// 会话模块 session
router
.post('/session', sessionController.post)
.get('/session', sessionController.get)
.delete('/session', sessionController.delete)

module.exports = router