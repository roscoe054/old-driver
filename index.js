var express = require('express')
var path = require("path")
var wechat = require('wechat')

// get config
var weConfig = require('./config')
var helper = require('./modules/helper')

// create app
var app = express()

// menu
var WechatAPI = require('wechat-api')
var menuModel = require('./modules/menu')
var api = new WechatAPI(weConfig.appid, weConfig.secret)
api.createMenu(menuModel, function(){})

// oauth
var OAuth = require('wechat-oauth');
var client = new OAuth(weConfig.appid, weConfig.secret);

// auto reply
app.use('/wechat', wechat(weConfig, function(req, res, next) {
	var msg = req.weixin

    if(msg.MsgType === 'event' && msg.Event === 'subscribe'){
        var bindingUrl = client.getAuthorizeURL('roscoe.cn/info', 'binding', 'snsapi_userinfo');
        res.reply('等你好久了！点击<a href="' + bindingUrl + '">链接</a>以完成绑定(ง •_•)ง')
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

// test reserve
app.get('/reserve', function(req, res) {
	res.sendFile(path.join(__dirname + '/reserve.html'))
})

// binding
app.get('/binding', function(req, res) {
    res.sendFile(path.join(__dirname + '/binding.html'))
})

// reserve
app.use(express.query())
app.get('/info', function(req, res) {
	helper.getBaseInfo(app, req.query.code, function(err, baseInfoQuery){
        if(err){
            res.send(JSON.stringify(err))
        } else{
            res.redirect(req.query.state + '?' + baseInfoQuery)
        }
	})
})

app.listen(weConfig.port)
