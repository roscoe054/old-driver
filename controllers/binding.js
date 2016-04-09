var request = require('request')

var host = 'http://115.159.119.199:8080/'

exports.page = {
	index: function(req, res) {
		res.render('./binding')
	}
}

exports.api = {
	state: function(req, res) {
        var url = host + 'userInfo?openId=' + req.query.openId
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				res.json(JSON.parse(body))
			} else{
                res.json(JSON.parse(error))
            }
		})
	},
	bind: function(req, res) {
        request.post({
            url: host + 'bindUser',
            form: req.body
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
				res.json(JSON.parse(body))
			} else{
                res.json(JSON.parse(error))
            }
        })
	}
}
