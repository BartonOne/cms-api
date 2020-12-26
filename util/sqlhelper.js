exports.andCondition = (query) => {
	// 如果没传 1+1:  SELECT * FROM users WHERE 1+1 
	// 如果有传 比如: {email: 'xxx', password: '123'}
	// SELECT * FROM users WHERE 1+1 and email='xxx' and password='123'
	let str = ' 1=1 '
	for (let key in query) {
		str += ` and ${key}='${query[key]}'`
	}
	return str
}