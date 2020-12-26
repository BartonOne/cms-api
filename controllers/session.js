const db = require('../models/db.js')
const md5 = require('blueimp-md5')

// 获取记录 拥有权限
exports.get = (req, res, next) => {
	try {
		const user = req.session.user
		if (!user) {
			return res.status(401).json({
				error: 'Unauthorized'
			})
		}
		res.status(200).json(user)
	} catch (err) {
		console.log(err)
	}
	
}

// 添加记录 登陆
exports.post = async (req, res, next) => {
	const body = req.body
	body.password = md5(body.password)

	const sqlStr = 
	`SELECT * FROM users WHERE email='${body.email}' and password='${body.password}'`
	try {
		const [user] = await db.query(sqlStr)
		if (!user) {
			return res.status(404).json({
				error: 'email or password error!'
			})
		}
		req.session.user = user
		res.status(201).json(user)
	} catch (err) {
		next(err)
	}
}

// 删除记录 退出
exports.delete = (req, res, next) => {
	delete req.session.user
	res.status(201).json({})
}