var express = require('express')
var path = require("path")

var wechat = require('wechat')
var OAuth = require('wechat-oauth')

var CONFIG = require('./config')

var weConfig = CONFIG || {
	token: 'token',
	appid: 'appid',
	secret: 'secret',
	encodingAESKey: 'encodingAESKey'
}

var app = express()

// oauth
var client = new OAuth(weConfig.appid, weConfig.secret)
var url = client.getAuthorizeURL('http%3A%2F%2F115.159.119.199%2Finfo', 'state', 'snsapi_userinfo');

// wechat api
var WechatAPI = require('wechat-api');
var api = new WechatAPI(weConfig.appid, weConfig.secret);
api.createMenu({
    "button": [{
        "type": "view",
        "name": "预定",
        "url": 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65cfe45c2c6fad4a&redirect_uri=http://roscoe.cn/info&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
    }, {
        "type": "view",
        "name": "我的",
        "url": 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65cfe45c2c6fad4a&redirect_uri=http://roscoe.cn/info&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect'
    }]
}, function(){})

app.use(express.query())
app.use('/wechat', wechat(weConfig, function(req, res, next) {
	// 微信输入信息都在req.weixin上
	var message = req.weixin

	if (message.Content === 'hehe') {
		res.reply('...')
	} else {
		res.reply('测试中...')
    }
}))

app.get('/hello', function(req, res) {
	res.send('hello')
})

app.get('/reserve', function(req, res) {
	res.sendFile(path.join(__dirname + '/reserve.html'))
})

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

app.listen(80)
