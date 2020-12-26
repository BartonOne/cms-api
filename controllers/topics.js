const db = require('../models/db')
const moment = require('moment')

exports.getList = async (req, res, next) => {
	try {
		// 获取参数
		let {_page = 1, _limit = 20} = req.query
		console.log(_page, _limit)
		if (_page < 1) {
			_page = 1
		}
		if (_limit < 1) {
			_limit = 1
		}
		if (_limit > 20) {
			_limit = 20
		}
		// 1  0  20
		// 2  20  20
		let start = (_page - 1) * _limit
		// sql语句
		const sqlStr = `SELECT * FROM topics LIMIT ${start}, ${_limit}`

		// 发送请求
		const topics = await db.query(sqlStr)
		const [{total}] = await db.query(`SELECT COUNT(*) as total FROM topics`)

		// 响应结果
		res.status(200).json({topics, total})
	} catch (err) {
		next(err)
	}
	
}

exports.getOne = async (req, res, next) => {
	try {
		// 1.获取参数
		const {id} = req.params

		// 2.sql
		const sqlStr = `
			SELECT * FROM topics WHERE id='${id}'
		`
		// 3.请求
		const [topic] = await db.query(sqlStr)

		// 4.响应结果
		res.status(200).json(topic)

	} catch (err) {
		next(err)
	}
}

exports.post = async (req, res, next) => {
	try {

		// 1获取参数
		const body = req.body

		body.user_id     = req.session.user.id
		body.create_time = moment().format('YYYY-MM-DD hh:mm:ss')
		body.modify_time  = moment().format('YYYY-MM-DD hh:mm:ss')

		// 2.sql语句
		const sqlStr = `
			INSERT INTO topics(
				title,
				content,
				user_id,
				create_time,
				modify_time
			)VALUES(
				'${body.title}',
				'${body.content}',
				'${body.user_id}',
				'${body.create_time}',
				'${body.modify_time}'
			)
		`

		// 3.请求
		const ret     = await db.query(sqlStr)
		const [topic] = await db.query(`SELECT * FROM topics WHERE id='${ret.insertId}'`) 

		// 4.响应结果
		res.status(201).json(topic)

	} catch (err) {
		next(err)
	}
}

exports.patch = async (req, res, next) => {
	try {
		// 1.获取参数
		const body = req.body
		body.modify_time = moment().format('YYYY-MM-DD hh:mm:ss')
		
		// 2.sql语句
		const sqlStr = `
			UPDATE topics SET 
				title='${body.title}',
				content='${body.content}',
				modify_time='${body.modify_time}'
			WHERE id='${req.params.id}'
		`

		// 3.请求
		await db.query(sqlStr)
		const [topic] = await db.query(`SELECT * FROM topics WHERE id='${req.params.id}'`)

		// 4.响应结果
		res.status(201).json(topic)

	} catch (err) {
		next(err)
	}
}

exports.delete = async (req, res, next) => {
	try {
		// 1.获取参数
		const { id } = req.params

		// 2.sql语句
		const sqlStr = `DELETE FROM topics WHERE id='${id}'`

		// 3.请求
		const ret = await db.query(sqlStr)

		// 4.响应结果
		res.status(201).json({})

	} catch (err) {
		next(err)
	}
}

