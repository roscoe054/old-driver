var moment = require('moment')

module.exports = {
    start: function(msg, done){
        // test semantic analysis
        var bosonnlp = require('bosonnlp');
        var nlp = new bosonnlp.BosonNLP('LYLJJvt9.5912.g1zeLUmF91s1');

        // fsm
        var StateMachine = require('javascript-state-machine')
        var fsm = StateMachine.create({
        	initial: 'nil',
        	events: [{
        		name: 'searchAction',
        		from: 'nil',
        		to: 'knowingAction'
        	}, {
        		name: 'searchTime',
        		from: 'knowingAction',
        		to: 'knowingTime'
        	}, {
        		name: 'sendRequest',
        		from: 'knowingTime',
        		to: 'sendingRequest'
        	}, {
        		name: 'fail',
        		from: ['knowingAction', 'knowingTime', 'sendingRequest'],
        		to: 'exit'
        	}],
        	callbacks: {
        		onknowingAction: function(event, from, to, msg){
        			// FIXME
        			nlp.ner(msg, function(resData) {
        				var result = (JSON.parse(resData)[0]),
        					tags = result.tag,
        					words = result.word

                        console.log(result);

        				tags.forEach(function(tag, i) {
        					if (tag === 'v') {
        						var identification = identifyAction(words[i])
        						if(identification && fsm.current === 'knowingAction'){
        							fsm.searchTime({
        								tags,
        								words,
        								action: identification
        							})
        						}
        					}
        				})
        			})
        		},
        		onknowingTime: function(event, from, to, msg){
        			var timeStr = '',
                        d = null
        			msg.tags.forEach(function(tag, i) {
        				if (tag === 't') {
        					timeStr += msg.words[i]
                            d = identifyTime(d, msg.words[i])
        				}
        			})
        			if(timeStr){
        				fsm.sendRequest({
        					action: msg.action,
        					time: {
                                from: d.from,
                                to: d.to
                            }
        				})
        			}
        		},
        		onsendingRequest: function(event, from, to, msg){
        			done(msg)
        		}
        	}
        })

        fsm.searchAction(msg)

        // 查询关键字
        function identifyAction(word) {
        	var targets = {
        		check: ['查看', '查询', '查'],
        		reserve: ['预定', '预订', '订'],
        	}
        	for(var i in targets){
        		if(targets.hasOwnProperty(i)){
        			var target = targets[i]

        			if(target.indexOf(word) > -1){
        				return i
        			}
        		}
        	}
        }

        function identifyTime(d, word) {
        	if(!d){
                d = {
                    from: moment().minute(0).second(0),
                    to: moment().minutes(0).seconds(0)
                }
            }
            switch (word) {
                case '上午':
                    d.from.hour(8)
                    d.to.hour(12)
                    break;
                case '下午':
                    d.from.hour(12)
                    d.to.hour(17)
                    break;
                case '晚上':
                    d.from.hour(17)
                    d.to.hour(21)
                    break;
                case '明天':
                    d.from.date(moment().add(1, 'days').date())
                    d.to.date(moment().add(1, 'days').date())
                    break;
                case '后天':
                    d.from.date(moment().add(2, 'days').date())
                    d.to.date(moment().add(2, 'days').date())
                    break;
                default:
            }
            return d
        }
    }
}
