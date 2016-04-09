var weConfig = require('../config')
var OAuth = require('wechat-oauth')
var WechatAPI = require('wechat-api')
var request = require('request')

var client = new OAuth(weConfig.appid, weConfig.secret)
var api = new WechatAPI(weConfig.appid, weConfig.secret)

module.exports = function(req, res, next) {
	var msg = req.weixin

	if (msg.MsgType === 'event' && msg.Event === 'subscribe') {
		var bindingUrl = client.getAuthorizeURL('http://roscoe.cn/info', 'binding', 'snsapi_userinfo');
		res.reply('等你好久了！<a href="' + bindingUrl + '">点击这里</a>以完成绑定(ง •_•)ง')
		next()
	}

	if (msg.MsgType === 'text') {
        request.post({
            url: 'http://dev.hivoice.cn/exp_center/nlu/testService2Demo.action',
            form: {
                serviceId: 6,
                question: '讲个笑话'
            }
        }, function(err, httpResponse, body) {
            if (err) {
                res.reply('服务器出了点小问题(´_ゝ`)')
                next()
            } else {
                var chatResMsg = body.match(/text":".+?"/g)[1].slice(7).slice(0, -1)
                res.reply(chatResMsg)
                next()
            }
        })
	}

	if (msg.MsgType === 'voice') {
		var recognition = msg.Recognition

		// TODO remove this test
		if (recognition && recognition !== "") {
			api.semantic(msg.FromUserName, {
				query: recognition,
				category: 'remind,datetime',
				city: '上海'
			}, function(err, result) {
				if (err || result.errcode) {
					request.post({
						url: 'http://dev.hivoice.cn/exp_center/nlu/testService2Demo.action',
						form: {
							serviceId: 6,
							question: '讲个笑话'
						}
					}, function(err, httpResponse, body) {
						if (err) {
							res.reply('服务器出了点小问题(´_ゝ`)')
                            next()
						} else {
							var chatResMsg = body.match(/text":".+?"/g)[1].slice(7).slice(0, -1)
							res.reply(chatResMsg)
                            next()
						}
					})
				} else {
					var remindText = '已设置提醒：\n' + semantic.datetime.date_ori + semantic.datetime.time_ori + '：' + semantic.event + '\n\n' + '如需取消提醒请<a href="#">点击这里</a>'
					res.reply(remindText)
                    next()
				}
			})
		} else {
			res.reply('不好意思没有听清(´_ゝ`)')
			next()
		}
	}
}
