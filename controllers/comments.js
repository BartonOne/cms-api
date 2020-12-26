const db = require('../models/db')
const moment = require('moment')

// exports.get = async (req, res, next) => {
// 	try {
// 		// 1.获取参数
// 		let {_page = 1, _limit = 20} = req.query
// 		if (_page < 1) {
// 			_page = 0
// 		}
// 		if (_limit < 1) {
// 			_limit = 1
// 		}
// 		if (_limit > 20) {
// 			_limit = 20
// 		}
// 		let start = (_page - 1) * _limit

// 		// 2.sql
// 		const sqlStr = `SELECT * FROM comments LIMIT ${start}, ${_limit}`

// 		// 3.发送请求
// 		const comment = await db.query(sqlStr)

// 		// 4.响应结果
// 		res.status(200).json(comment)
// 	} catch (err) {
// 		next(err)
// 	}
// }

exports.getSome = async (req, res, next) => {
	try {
		// 1.获取参数
		const {topic_id} = req.query

		// 2.sql
		const sqlStr = `
			SELECT * FROM comments WHERE topics_id='${topic_id}'
		`

		// 3.发送请求
		const comment = await db.query(sqlStr)

		// 4.响应结果
		res.status(200).json(comment)

	} catch (err) {
		next(err)
	}
}

exports.post = async (req, res, next) => {
	try {
		// 1.获取参数
		const body = req.body

		// moment().format('YYYY-MM-DD hh:mm:ss')
		body.content = body.content || ''
		body.create_time = Date.now()
		body.modify_time = Date.now()
		body.user_id = req.session.user.id
		body.praise = 0
		body.reply_id = 0

		console.log(body)
		// 2.sql
		const sqlStr = `INSERT INTO comments(
							content,
							create_time,
							modify_time,
							topics_id,
							user_id,
							praise,
							reply_id
						)VALUE(
							'${body.content}',
							'${body.create_time}',
							'${body.modify_time}',
							'${body.topics_id}',
							'${body.user_id}',
							'${body.praise}',
							'${body.reply_id}'
						)`

		// 3.发送请求
		const ret = await db.query(sqlStr)

		const [comment] = await db.query(`SELECT * FROM comments WHERE id='${ret.insertId}'`)
		// 4.响应结果
		res.status(201).json(comment)
	} catch (err) {
		next(err)
	}
}

exports.patch = async (req, res, next) => {
	try {
		// 1.获取参数
		const {id} = req.params
		const body = req.body

		// moment().format('YYYY-MM-DD hh:mm:ss')
		body.modify_time = Date.now()

		// 2.sql
		const sqlStr = `UPDATE comments SET 
							praise='${body.praise}',
							modify_time='${body.modify_time}'
							WHERE id='${id}'`

		// 3.发送请求
		await db.query(sqlStr)

		const [comment] = await db.query(`SELECT * FROM comments WHERE id='${id}'`)
		// 4.响应结果
		res.status(201).json(comment)
	} catch (err) {
		next(err)
	}
}

exports.delete = async (req, res, next) => {
	try {
		// 1.获取参数
		const {id} = req.params

		// 2.sql
		const sqlStr = `DELETE FROM comments WHERE id='${id}'`

		// 3.发送请求
		await db.query(sqlStr)

		// 4.响应结果
		res.status(201).json({})
	} catch (err) {
		next(err)
	}
}