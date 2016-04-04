var express = require('express')
var path = require("path")
var wechat = require('wechat')

// get config
var weConfig = require('./config')

// create app
var app = express()

// menu
var WechatAPI = require('wechat-api')
var menuModel = require('./modules/menu')
var api = new WechatAPI(weConfig.appid, weConfig.secret)
api.createMenu(menuModel, function(){})

// auto reply
app.use('/wechat', wechat(weConfig, function(req, res, next) {
	// 微信输入信息都在req.weixin上
	var msg = req.weixin

    if(msg.MsgType === 'event' && msg.Event === 'subscribe'){
        res.reply('等你好久了，点击<a href="baidu.com">链接</a>以完成绑定')
        next()
    }

    if(msg.MsgType === 'text'){
        if (msg.Content === 'hehe') {
    		res.reply('...')
    	} else {
    		res.reply('测试中...')
        }
        next()
    }
}))

// test
app.get('/reserve', function(req, res) {
	res.sendFile(path.join(__dirname + '/reserve.html'))
})

// get user base info
var OAuth = require('wechat-oauth')
var client = new OAuth(weConfig.appid, weConfig.secret)
app.use(express.query())
app.get('/info', function(req, res) {
	client.getAccessToken(req.query.code, function(err, result) {
		var accessToken = result.data.access_token
		var openid = result.data.openid

		client.getUser(openid, function(err, baseInfo) {
			var query = ''
			Object.keys(baseInfo).forEach(function(infoName) {
				query += '&' + infoName + '=' + baseInfo[infoName]
			})
			res.redirect('/reserve?' + query.slice(1))
		})
	})
})

app.listen(weConfig.port)
