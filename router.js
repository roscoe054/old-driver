var express = require('express')
var router = express.Router()

var path = require('path')

// controllers
var binding = require("./controllers/binding.js")

// getBaseInfo
router.use(express.query())
router.get('/info', function(req, res) {
	helper.getBaseInfo(app, req.query.code, function(err, baseInfoQuery){
        if(err){
            res.send(JSON.stringify(err))
        } else{
            res.redirect(req.query.state + '?' + baseInfoQuery)
        }
	})
})

// pages
router.get('/binding', binding.index)

router.get('/reserve', function(req, res) { // FIXME 这里应该redirect到预定会议室页面
	res.sendFile(path.join(__dirname + '/views/reserve.html'))
})

// apis
router.post('/api/binding', function(req, res) {
    res.send('succeed')
})

module.exports = router
