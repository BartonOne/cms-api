const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

// 为决绝错误
// app.all('*', function(req, res, next) {

    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("Access-Control-Allow-Origin", "*"); //跨域决绝方式
    // res.header("Content-Type", "application/json; charset=utf-8");
    // res.header("Content-Type", "text/html; charset=utf-8");
    // res.header("X-Powered-By", ' 3.2.1')
    // next();
// });


// session 登陆记录 配置
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

// bodyParser 配置
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router)

// 统一处理 500 错误
app.use((err, req, res, next) => {
	res.status(500).json({
		error: err.message,
	});
})


app.listen(3002, err => {
	console.log('3002 start...')
})