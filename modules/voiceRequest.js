var request = require('request')
var async = require('async')

var host = 'http://115.159.119.199:8080/'

module.exports = {
	check: function(fsmRes, callback) {
        var resultStr = '可用房间',
            time = fsmRes.time

		resultStr += fsmRes.location ? '（' + fsmRes.location + '）' : ''
		resultStr += ':\n'

		var obj = {
			site: 1,
			from: time.from.format('x'),
			to: time.to.format('x')
		}
		console.log(obj);

		requestGet(host + 'getRoomList', {
			site: 1,
			from: time.from.format('x'),
			to: time.to.format('x')
		}, function(roomList) {
			if(!roomList || roomList.length === 0){
				callback('找不到可用会议室(´_ゝ`)')
				return
			}

			async.each(roomList, function(room, itemCallback) {
                requestGet(host + 'getRoomInfo', {
        			roomId: room.roomId,
        			date: time.from.format('YYYY-MM-DD'),
        		}, function(data){
                    resultStr += data.roomName + ' - '
                            + Math.max(time.from.hour(), data.time.begin) + '点~'
                            + Math.min(time.to.hour(), data.time.end) + '点' + '\n'
                    itemCallback()
                })
			}, function(err) {
				if (err) {
                    callback('找不到可用会议室(´_ゝ`)')
				} else {
                    callback(resultStr)
				}
			})
		})

	},
	reserve: function() {
		console.log('reserve');
	},
}

function requestGet(url, qs, callback) {
	request.get({
		url: url,
		qs: qs
	}, function(err, httpResponse, body) {
		if (err) {
			callback(JSON.parse(err))
		} else {
			var res = JSON.parse(body)
			if (res.ret) {
				callback(res.data)
			} else {
				callback(res.msg)
			}
		}
	})
}
