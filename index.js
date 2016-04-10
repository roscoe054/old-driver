var express = require('express')
var path = require('path')
var wechat = require('wechat')

// get config
var weConfig = require('./config')

// create app
var app = express()

// gzip
var compress = require('compression')
app.use(compress())

// parse body
var bodyParser = require('body-parser')
app.use(bodyParser.json())

// statics
app.use("/public", express.static(__dirname + '/public'));

// menu
var WechatAPI = require('wechat-api')
var menuModel = require('./modules/menu')
var api = new WechatAPI(weConfig.appid, weConfig.secret)
api.createMenu(menuModel, function() {})

// view engine
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)
app.set('views', path.join(__dirname, 'views'))

// auto reply
var msgHandler = require('./modules/msgHandler')
app.use('/wechat', wechat(weConfig, function(req, res, next) {
	msgHandler(req, res, next)
}))

// router
var router = require('./router')
app.use('/', router)

// schedule
var schedule = require('./modules/schedule')
schedule.init(api)

// test msg
// msgHandler({
// 	weixin: {
// 		MsgType: 'voice',
// 		Recognition: '你是谁'
// 	}
// }, {
// 	reply: function(msg){
// 		console.log(msg);
// 	}
// }, function(){})

// test request get
var request = require('request')


app.listen(weConfig.port)
