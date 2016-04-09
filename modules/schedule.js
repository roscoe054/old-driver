var moment = require('moment')
var request = require('request')

var mock = {
	recentMeetings: [{
		attendeeOpenIds: ['o1__FsxGOvh12CjS8ZtZqcwYtZXA'],
		meetingName: '我的会议1',
		meetingRoom: '九州岛',
		from: '1460170070059',
		to: '1460170080059',
		bookerName: 'yuhao.ju'
	}],
	newMeetings: [{
		attendeeOpenIds: ['o1__FsxGOvh12CjS8ZtZqcwYtZXA'],
		meetingName: '我的会议2',
		meetingRoom: '格林威治',
		from: '1460170070059',
		to: '1460170080059',
		bookerName: 'yuhao.ju'
	}]
}

var MEETING_TYPE = {
    'NEW': 'new',
    'RECENT': 'recnet'
}

var initSchedule = function(api) {
	var schedule = require('node-schedule')

	var j = schedule.scheduleJob('*/1 * * * *', function() {
		console.log('schedule processing')
		getRemindRList(function(resData) {
			sendRemind(resData.data.recentMeetings, MEETING_TYPE.RECENT, api)
			sendRemind(resData.data.newMeetings,  MEETING_TYPE.NEW, api)
		})
	})
}

function sendRemind(meetings, type, api) {
	if(!meetings || meetings.length === 0){
		return
	}

    meetings.forEach(function(meeting) {
        var msg = ''

        if(type === MEETING_TYPE.RECENT){
            msg = '哈喽：您近期有一个会议\n'
                + '会议室：' + meeting.roomName + '\n'
                + '时间：' + getFormedDateRange(meeting.fromTime, meeting.toTime) + '\n'
                + '请您准时到场 谢谢'
        } else if(type === MEETING_TYPE.NEW){
            msg = '哈喽：您有一个会议邀请\n'
                + '会议室：' + meeting.roomName + '\n'
                + '时间：' + getFormedDateRange(meeting.fromTime, meeting.toTime) + '\n'
                + '如有特殊情况请联系发起人'
        }

        if (meeting.attendeeOpenIds) {
            meeting.attendeeOpenIds.forEach(function(openid) {
                // FIXME 发送消息
                api.sendText(openid, msg, function(err) {
					console.log('send' + msg);
                	if(err){
                        console.log(err);
                    }
                })
            })
        }
    })
}

function getFormedDateRange(from, to){
    var fromStr = moment(Number(from)).format("M月D日 hh:mm"),
        toStr = moment(Number(to)).format("hh:mm")

    return fromStr + '-' + toStr
}

function getRemindRList(callback) {
	request('http://115.159.119.199:8080/getMessages', function(error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(JSON.parse(body))
		} else{
			callback(JSON.parse(error))
		}
	})

}

module.exports = {
	init: initSchedule
}
