var reserveUrl = encodeURIComponent('http://115.159.119.199:8080/meeting/src/html/app.html#search')

module.exports = {
    "button": [{
        "type": "view",
        "name": "预定",
        "url": 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65cfe45c2c6fad4a&redirect_uri=' + reserveUrl + '&response_type=code&scope=snsapi_userinfo&state=reserve#wechat_redirect'
    }]
}
