var weConfig = require('../config')
var OAuth = require('wechat-oauth')
var WechatAPI = require('wechat-api')
var request = require('request')

var fsm = require('./fsm')
var voiceReq = require('./voiceRequest')

var client = new OAuth(weConfig.appid, weConfig.secret)
var api = new WechatAPI(weConfig.appid, weConfig.secret)

module.exports = function(req, res, next) {
	var msg = req.weixin

	if (msg.MsgType === 'event' && msg.Event === 'subscribe') {
		var bindingUrl = client.getAuthorizeURL('http://roscoe.cn/info', 'binding', 'snsapi_userinfo')
		res.reply('等你好久了！<a href="' + bindingUrl + '">点击这里</a>以完成绑定(ง •_•)ง')
		next()
	}

	if (msg.MsgType === 'text') {
        getChatRes(msg.Content, function(resText){
            res.reply(resText)
            next()
        })
	}

	if (msg.MsgType === 'voice') {
		var recognition = msg.Recognition

		if (recognition && recognition !== "") {
            // 微信自带语义分析，查看是否是提醒
			api.semantic(msg.FromUserName, {
				query: recognition,
				category: 'remind',
				city: '上海'
			}, function(err, result) {
				if (err || result.errcode) {
                    // 自定义规则
                    fsm.start(recognition, function(fsmRes){
                        if(fsmRes && voiceReq[fsmRes.action]){
                            voiceReq[fsmRes.action](fsmRes, function(resText){
                                res.reply(resText)
                                next()
                            })
                        } else{
                            // 其它消息交给聊天机器人
                            getChatRes(recognition, function(resText){
                                res.reply(resText)
                                next()
                            })
                        }
                    })
				} else {
					var remindText = '已设置提醒：\n'
                        + result.semantic.datetime.date_ori
                        + result.semantic.datetime.time_ori + '：'
                        + result.semantic.event + '\n\n'
                        + '如需取消提醒请<a href="#">点击这里</a>'

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

function getChatRes(msgText, callback){
    request.post({
        url: 'http://dev.hivoice.cn/exp_center/nlu/testService2Demo.action',
        form: {
            serviceId: 6,
            question: msgText
        }
    }, function(err, httpResponse, body) {
        if (err) {
            callback('服务器出了点小问题(´_ゝ`)')
        } else {
            var chatResMsg = body.match(/"text\\":\\".+?\\"/g)[1].slice(10).slice(0, -2)
            callback(chatResMsg)
        }
    })
}
