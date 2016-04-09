var weConfig = require('../config')
var OAuth = require('wechat-oauth')
var WechatAPI = require('wechat-api')

var client = new OAuth(weConfig.appid, weConfig.secret)
var api = new WechatAPI(weConfig.appid, weConfig.secret)

module.exports = function(req, res, next){
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

	if(msg.MsgType === 'voice'){
		var recognition = msg.Recognition

		// TODO remove this test
		if(recognition && recognition !== ""){
			api.semantic(msg.FromUserName, {
				query: recognition,
				category: 'remind',
				city: '上海'
			}, function(err, result){
                var semantic = result.semantic.details

				if(err){
					res.reply('服务器出了点小问题(´_ゝ`)')
				} else if(!semantic || !semantic.event || !semantic.datetime){
                    res.reply('我好像没理解(´_ゝ`)')
                } else{
                    var remindText = '已设置提醒：'
                                + semantic.datetime.date_ori
                                + semantic.datetime.time_ori + '：'
                                + semantic.event + '\n'
                                + '<a href="#">点击这里</a>取消提醒'
					res.reply(remindText)
				}
				next()
			})
		} else{
			res.reply('不好意思没有听清(´_ゝ`)')
			next()
		}
	}
}
