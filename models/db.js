const mysql  = require('mysql')

// 创建连接池
const pool = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'cms'
})


exports.query = function (sqlStr) {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				return reject(err)
			}			
			// 操作
			connection.query(sqlStr, (error, ...args) => {
				connection.release()
				if (error) {
					return reject(error)
				}
				resolve(...args)
			})
		})
	})
	
}