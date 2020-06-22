const util = require('../util.js')
const config = require('../config.js')

const rcv = /(puggi)|(普吉)|(噗噗)|(pupu)|(プギ)|(ププ)/
const ans1 = {
	'ZH': '普吉',
	'EN': 'Puggi',
	'JP': 'プギ'
}
const ans2 = [{
	'ZH': '看讀取畫面不就知道了嗎？本大爺就是主角！',
	'EN': 'See the loading screen? I\'m the main character!',
	'JP': 'ロード画面を見ればわかるじゃん？主役はこの俺！'
},{
	'ZH': '咻～咻～！好像很有趣的樣子！',
	'EN': 'whoosh~whoosh~Looks interesting!',
	'JP': 'ヒューヒュー！なんか面白そうじゃん！'
},{
	'ZH': '普吉普吉♥，普吉普吉、普吉普吉普吉普～♥',
	'EN': 'PuggiPuggi♥, PuggiPuggi, PuggiPuggiPuggiPu~♥',
	'JP': 'プギプギ♥プギプギ、プギプギプギプー♥'
},{
	'ZH': '噗噗噗～！',
	'EN': 'PuPuPu~!',
	'JP': 'プププー！'
},{
	'ZH': '嘿嘿～！',
	'EN': 'Hehe~!',
	'JP': 'ヘッヘー！'
},{
	'ZH': '普～吉～♥',
	'EN': 'Pu~ggi~♥',
	'JP': 'プーギー♥'
},{
	'ZH': '隨便啦～',
	'EN': 'whatever~',
	'JP': 'なんでもいっかー'
},{
	'ZH': '普吉普吉普吉普吉！',
	'EN': 'PuggiPuggiPuggiPuggi!',
	'JP': 'プギプギプギプギ！'
},{
	'ZH': '普吉！',
	'EN': 'Puggi!',
	'JP': 'プーギ！'
},{
	'ZH': '呿，真是的麻煩死了…',
	'EN': 'You\'re such a pain in the ass!',
	'JP': 'ちっ、もうめんどくせー'
},{
	'ZH': '吶哈哈哈！咳哎唷哎唷哎唷～',
	'EN': 'Hahaha! @#$%^&*%$~',
	'JP': 'ゲッハハハウヨウヨウヨ'
},{
	'ZH': '你這個臭小子！',
	'EN': 'You son of a bitch!',
	'JP': 'こーのクッソガキが！'
},{
	'ZH': '嗚哎哎哎呀！嘿咻，啊喔喔喔喔喔！',
	'EN': 'UEEEE! #$%@ AOOOOOOO',
	'JP': 'ウエエエエ！ウッショ、アオオオオオ！'
},{
	'ZH': '普吉啊啊啊～～～！',
	'EN': 'PUGGIAAAA!',
	'JP': 'プギャァァァ！'
},{
	'ZH': '我這麼可愛你為什麼還要打我啊！',
	'EN': 'I\'m so cute, why hit me!',
	'JP': 'こんなかわいいのに殴るなんて！'
},{
	'ZH': '這難道是我的錯嗎？',
	'EN': 'How could this be my fault?',
	'JP': '俺が悪いっていうの？'
},{
	'ZH': '整個Sdorica都沒有能贏過我的傢伙呢～',
	'EN':	'Not a single person in Sdorica can beat me~',
	'JP': 'スドリカのどこを探しても、俺に勝てる奴なんていないねー'
},{
	'ZH': '喵哈哈哈哈哈哈哈哈！',
	'EN': 'NYAHAHAHAHAHAHA!',
	'JP': 'ニャハハハハハハハハ！'
},{
	'ZH': 'PUGWRRRRRYYYYYYYYY！',
	'EN': 'PUGWRRRRRYYYYYYYYY!',
	'JP': 'プギWRRRRRYYYYYYYYY！'
}]

function ping(msg, bot) {
	if (rcv.test(msg.content.toLowerCase()) ||
	    msg.mentions.members.has(bot.user.id)) {
		let tar = util.random(ans2)
		tar = util.random([ans1, ans1, ans1, tar])
		msg.channel.send(util.getLangStr(msg, tar))
			.catch(err=>util.catch(`(ping) ` + err, msg.channel))
	}
}

module.exports = function(bot) {
	bot.on('message', msg => {
		if (!util.checkMember(msg)) return
		// use is instead of checkChannel to avoid report
		if ([config.channels.spam, config.channels.cmd, config.channels.debug]
			.includes(msg.channel.id)) ping(msg, bot)
	})
}