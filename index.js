var express = require('express')
var path = require('path')
var wechat = require('wechat')

// get config
var weConfig = require('./config')

// create app
var app = express()

// statics
app.use("/public", express.static(__dirname + '/public'));

// menu
var WechatAPI = require('wechat-api')
var menuModel = require('./modules/menu')
var api = new WechatAPI(weConfig.appid, weConfig.secret)
api.createMenu(menuModel, function(){})

// oauth
var OAuth = require('wechat-oauth')
var client = new OAuth(weConfig.appid, weConfig.secret)

// view engine
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)
app.set('views', path.join(__dirname, 'views'))

// auto reply
app.use('/wechat', wechat(weConfig, function(req, res, next) {
	var msg = req.weixin

    if(msg.MsgType === 'event' && msg.Event === 'subscribe'){
        var bindingUrl = client.getAuthorizeURL('http://roscoe.cn/info', 'binding', 'snsapi_userinfo');
        res.reply('等你好久了！<a href="' + bindingUrl + '">点击这里</a>以完成绑定(ง •_•)ง')
        next()
    }

    if(msg.MsgType === 'text'){
        if (msg.Content === 'hehe') {
    		res.reply('...')
    	} else {
    		res.reply('这学期暂时不开啦，不好意思〒▽〒')
        }
        next()
    }
}))

// router
var router = require('./router')
app.use('/', router);

app.listen(weConfig.port)
