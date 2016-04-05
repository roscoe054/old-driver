var weConfig = require('../config')

module.exports = {
    getBaseInfo: function(code, callback){
        var express = require('express')
        var OAuth = require('wechat-oauth')
        var client = new OAuth(weConfig.appid, weConfig.secret)

    	client.getAccessToken(code, function(err, result) {
            if(err){
                callback(err)
            }

    		var accessToken = result.data.access_token
    		var openid = result.data.openid

    		client.getUser(openid, function(err, baseInfo) {
                var query = ''
                Object.keys(baseInfo).forEach(function(infoName) {
                    query += '&' + infoName + '=' + baseInfo[infoName]
                })

    			callback(err, query.slice(1))
    		})
    	})
    }
}
