var express = require('express')
var path    = require("path")

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

app.use(express.query())
app.use('/wechat', wechat(weConfig, function(req, res, next) {
	// 微信输入信息都在req.weixin上
	var message = req.weixin
	if (message.Content === 'diaosi') {
		// 回复屌丝(普通回复)
		res.reply('hehe ', url)
	} else if (message.Content === 'text') {
		//你也可以这样回复text类型的信息
		res.reply({
			content: 'text object',
			type: 'text'
		})
	} else if (message.Content === 'hehe') {
		// 回复一段音乐
		res.reply({
			type: "music",
			content: {
				title: "来段音乐吧",
				description: "一无所有",
				musicUrl: "http://mp3.com/xx.mp3",
				hqMusicUrl: "http://mp3.com/xx.mp3",
				thumbMediaId: "thisThumbMediaId"
			}
		})
	} else {
		// 回复高富帅(图文回复)
		res.reply([{
			title: '你来我家接我吧',
			description: '这是女神与高富帅之间的对话',
			picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
			url: 'http://nodeapi.cloudfoundry.com/'
		}])
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
            Object.keys(baseInfo).forEach(function(infoName){
                query += '&' + infoName + '=' + baseInfo[infoName]
            })
            res.redirect('/reserve?' + query.slice(1))
		})
	})
})

app.listen(80)
