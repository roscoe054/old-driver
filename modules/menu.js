var jumpPage = encodeURIComponent('reserve')

module.exports = {
    "button": [{
        "type": "view",
        "name": "预定",
        "url": 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx65cfe45c2c6fad4a&redirect_uri=http://roscoe.cn/info&response_type=code&scope=snsapi_userinfo&state=' + jumpPage + '#wechat_redirect'
    }]
}
