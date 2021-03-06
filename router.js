var express = require('express')
var router = express.Router()

var path = require('path')
var helper = require('./modules/helper')

// import controllers
var binding = require("./controllers/binding.js")

// getBaseInfo
router.use(express.query())
router.get('/info', function(req, res) {
	helper.getBaseInfo(req.query.code, function(err, baseInfoQuery){
        if(err){
            res.send(JSON.stringify(err))
        } else{
			var openId = JSON.stringify(baseInfoQuery).match(/openid=.+?&/)[0].slice(7).slice(0, -1),
				jumpTo = req.query.state

			if(req.query.state === 'search'){
				jumpTo = 'http://115.159.119.199:8080/meeting/src/html/app.html#search'
			} else if(req.query.state === 'reservation'){
				jumpTo = 'http://115.159.119.199:8080/meeting/src/html/app.html#reservation'
			}

            res.redirect(jumpTo + '?openId=' + openId)
        }
	})
})

// bind
router.get('/binding', binding.page.index)
router.get('/api/binding/state', binding.api.state)
router.post('/api/binding/bind', binding.api.bind)

// FIXME 这里应该redirect到预定会议室页面
router.get('/reserve', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/reserve.html'))
})

module.exports = router
