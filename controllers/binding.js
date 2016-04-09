var request = require('request')

exports.page = {
    index: function (req, res) {
        res.render('./binding')
    }
}

exports.api = {
    state: function(req, res) {
        // TODO
        console.log(req.query)
        res.json({
            ret: true,
            data: {state: 0}
        })
    },
    bind: function(req, res) {
        // TODO
        console.log(req.body)
        res.json({
            ret: true,
            data: {state: 1}
        })
    }
}
