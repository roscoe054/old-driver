var weConfig = require('../config')

module.exports = {
    getBaseInfo: function(app, code, callback){
        var express = require('express')
        var OAuth = require('wechat-oauth')
        var client = new OAuth(weConfig.appid, weConfig.secret)

        app.use(express.query())
    	client.getAccessToken(code, function(err, result) {
            if(err){
                callback(err)
            }

    		var accessToken = result.data.access_token
    		var openid = result.data.openid

    		client.getUser(openid, function(err, baseInfo) {
    			callback(err, baseInfo)
    		})
    	})
    }
}
