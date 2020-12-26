const md5 = require('blueimp-md5')
const moment = require('moment')
const db = require('../models/db.js')
const sqlhelper = require('../util/sqlhelper')

exports.get = async (req, res, next) => {
	try {
		console.log(req.query)
		// 1.获取参数
		const andConditionStr = sqlhelper.andCondition(req.query)

		// 2.sql语句
		const sqlStr = `
			SELECT * FROM users WHERE ${andConditionStr}
		`
		// 3.请求
		const users = await db.query(sqlStr)
		console.log(users)
		// 4.响应
		res.status(200).json(users)

	} catch (err) {
		console.log('错误:', err)
		next(err)
	}
}

exports.getOne = async (req, res, next) => {
	try {
		// 1.获取参数
		const {id} = req.params

		// 2.sql语句
		const sqlStr = `
			SELECT * FROM users WHERE id='${id}'
		`
		// 3.请求
		const [user] = await db.query(sqlStr)
		console.log(user)
		// 4.响应
		res.status(200).json(user)

	} catch (err) {
		console.log('错误:', err)
		next(err)
	}
}

exports.post = async (req, res, next) => {
	try {
		// 1.获取参数
		const body = req.body
		console.log('body88:',req.body)
		// 2.sql语句
		const sqlStr = `
			INSERT INTO users(
				username, 
				password,
				email,
				nickname,
				avatar,
				gender,
				create_time,
				modify_time
			)VALUES(
				'${body.email}',
				'${md5(body.password)}',
				'${body.email}',
				'${body.nickname}',
				'default-avatar.png',
				0,
				'${moment().format('YYYY-MM-DD hh:mm:ss')}',
				'${moment().format('YYYY-MM-DD hh:mm:ss')}'
			)
		`
		
		// 3.发送请求
		const ret = await db.query(sqlStr)

		// 4.查找添加-对象
		const users = await db.query(`SELECT * FROM users WHERE id='${ret.insertId}'`)

		// 5.返回结果-对象
		res.status(201).json(users[0])
		
	} catch(err) {
		next(err)
		// res.status(500).json({
		// 	error: err.message
		// })
	}
	
}

exports.patch = async (req, res, next) => {
	try {

		// 1.获取参数
		const {id} = req.params
		body = req.body
		const [oldUser] = await db.query(`SELECT * FROM users WHERE id='${id}'`)

		if (body.password) {
			body.password = md5(body.password)
		} else {
			body.password = oldUser.password
		}
		body.email = body.email || oldUser.email
		body.nickname = body.nickname || oldUser.nickname
		body.avatar = body.avatar || oldUser.avatar
		body.gender = body.gender || 0
		body.modify_time = moment().format('YYYY-MM-DD hh:mm:ss')

		// 2.sql语句
		const sqlStr = `UPDATE users SET 
							password='${body.password}',
							email='${body.email}',
							nickname='${body.nickname}',
							avatar='${body.avatar}',
							gender=${body.gender},
							modify_time='${body.modify_time}'
						WHERE id='${id}'`

		// 3.发送请求
		await db.query(sqlStr)
		const [user] = await db.query(`SELECT * FROM users WHERE id='${id}'`)

		// 4.响应结果
		res.status(201).json(user)
	} catch (err) {
		next(err)
	}
}

exports.delete = async (req, res, next) => {
	try {
		// 1.获取参数
		const {id} = req.params

		// 2.sql
		const sqlStr = `DELETE FROM users WHERE id='${id}'`

		// 2.请求
		await db.query(sqlStr)

		// 3.响应
		res.status(201).json({})
	} catch (err) {
		next(err)
	}
}