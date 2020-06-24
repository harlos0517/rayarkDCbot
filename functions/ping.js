const util = require('../util.js')
const config = require('../config.js')
const Attachment = require('discord.js').MessageAttachment

const rcv = /(puggi)|(普吉)|(噗噗)|(pupu)|(プギ)|(ププ)/
const ans1 = {
	'ZH': '普吉',
	'EN': 'Puggi',
	'JP': 'プギ'
}
const ans2 = [{
	ZH: '看讀取畫面不就知道了嗎？本大爺就是主角！',
	EN: 'See the loading screen? I\'m the main character!',
	JP: 'ロード画面を見ればわかるじゃん？主役はこの俺！',
	audio: 'https://sdorica.xyz/images/2/2b/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E9%AD%82%E5%86%8A1.mp3'
},{
	ZH: '咻～咻～！好像很有趣的樣子！',
	EN: 'shoo~shoo~!Looks interesting!',
	JP: 'ヒューヒュー！なんか面白そうじゃん！',
	audio: 'https://sdorica.xyz/images/9/9f/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E9%AD%82%E5%86%8A2.mp3'
},{
	ZH: '普吉普吉♥，普吉普吉、普吉普吉普吉普～♥',
	EN: 'PuggiPuggi♥, PuggiPuggi, PuggiPuggiPuggiPu~♥',
	JP: 'プギプギ♥プギプギ、プギプギプギプー♥',
	audio: 'https://sdorica.xyz/images/c/c6/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E9%AD%82%E5%86%8A3.mp3'
},{
	ZH: '噗噗噗～！',
	EN: 'PuPuPu~!',
	JP: 'プププー！',
	audio: 'https://sdorica.xyz/images/6/6f/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E9%81%B8%E6%93%87%E8%A7%92%E8%89%B21.mp3'
},{
	ZH: '普～吉～',
	EN: 'Pu~ggi~',
	JP: 'プーギー',
	audio: 'https://sdorica.xyz/images/6/6f/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E9%81%B8%E6%93%87%E8%A7%92%E8%89%B21.mp3'
},{
	ZH: '嘿嘿～！',
	EN: 'Hehe~!',
	JP: 'ヘッヘー！',
	audio: 'https://sdorica.xyz/images/e/e1/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E9%81%B8%E6%93%87%E8%A7%92%E8%89%B23.mp3'
},{
	ZH: '普～吉～♥',
	EN: 'Pu~ggi~♥',
	JP: 'プーギー♥',
	audio: 'https://sdorica.xyz/images/c/c6/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E4%B8%80%E9%AD%82%E6%8A%80%E8%83%BD%EF%BC%88%E4%BA%8C%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '隨便啦～',
	EN: 'whatever~',
	JP: 'なんでもいっかー',
	audio: 'https://sdorica.xyz/images/c/c6/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E4%B8%80%E9%AD%82%E6%8A%80%E8%83%BD%EF%BC%88%E4%BA%8C%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '普吉普吉普吉普吉！',
	EN: 'PuggiPuggiPuggiPuggi!',
	JP: 'プギプギプギプギ！',
	audio: 'https://sdorica.xyz/images/9/95/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E5%9B%9B%E9%AD%82%E6%8A%80%E8%83%BD%EF%BC%88%E4%BA%8C%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '普吉！',
	EN: 'Puggi!',
	JP: 'プーギ！',
	audio: 'https://sdorica.xyz/images/b/b7/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E5%8F%83%E8%AC%80%E6%8A%80%E8%83%BD%EF%BC%88%E4%BA%8C%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '水汪汪大眼～♥',
	EN: 'KYURURURURUN~♥',
	JP: 'キュルルルーン♥',
	audio: 'https://sdorica.xyz/images/f/fa/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E4%B8%80%E9%AD%82%E6%8A%80%E8%83%BD%EF%BC%88%E4%B8%89%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '呿，真是的麻煩死了…',
	EN: 'What a pain in the ass...',
	JP: 'ちっ、もうめんどくせー',
	audio: 'https://sdorica.xyz/images/9/99/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E4%BA%8C%E9%AD%82%E6%8A%80%E8%83%BD%EF%BC%88%E4%B8%89%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '吶哈哈哈！咳哎唷哎唷哎唷～',
	EN: 'Hahaha! @#$%^&*%$~',
	JP: 'ゲッハハハウヨウヨウヨ',
	audio: 'https://sdorica.xyz/images/9/9a/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E5%9B%9B%E9%AD%82%E6%8A%80%E8%83%BD%EF%BC%88%E4%B8%89%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '你這個臭小子！',
	EN: 'You son of a bitch!',
	JP: 'こーのクッソガキが！',
	audio: 'https://sdorica.xyz/images/c/ca/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E5%9B%9B%E9%AD%82%E6%8A%80%E8%83%BD%EF%BC%88ALT%EF%BC%89.mp3'
},{
	ZH: '嗚哎哎哎呀！嘿咻，啊喔喔喔喔喔！',
	EN: 'UEEEE! #$%@ AOOOOOOO',
	JP: 'ウエエエエ！ウッショ、アオオオオオ！',
	audio: 'https://sdorica.xyz/images/9/9a/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E8%A2%AB%E5%8B%95%E6%8A%80%E8%83%BD%EF%BC%88%E4%B8%89%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '普吉啊啊啊～～～！',
	EN: 'PUGGIAAAA!',
	JP: 'プギャァァァ！',
	audio: 'https://sdorica.xyz/images/4/40/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E8%A2%AB%E5%8B%95%E6%8A%80%E8%83%BD%EF%BC%88ALT%EF%BC%89.mp3'
},{
	ZH: '我這麼可愛你為什麼還要打我啊！',
	EN: 'I\'m so cute, why hit me!',
	JP: 'こんなかわいいのに殴るなんて！',
	audio: 'https://sdorica.xyz/images/8/8b/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E6%AD%BB%E4%BA%A1%EF%BC%88%E4%B8%89%E9%9A%8E%EF%BC%89.mp3'
},{
	ZH: '這難道是我的錯嗎？',
	EN: 'How could this be my fault?',
	JP: '俺が悪いっていうの？',
	audio: 'https://sdorica.xyz/images/2/21/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E5%8B%9D%E5%88%A91.mp3'
},{
	ZH: '整個Sdorica都沒有能贏過我的傢伙呢～',
	EN:	'Not a single person in Sdorica can beat me~',
	JP: 'スドリカのどこを探しても、俺に勝てる奴なんていないねー',
	audio: 'https://sdorica.xyz/images/9/95/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E5%8B%9D%E5%88%A92.mp3'
},{
	ZH: '喵哈哈哈哈哈哈哈哈！',
	EN: 'NYAHAHAHAHAHAHA!',
	JP: 'ニャハハハハハハハハ！',
	audio: 'https://sdorica.xyz/images/0/03/%E8%AA%9E%E9%9F%B3_%E6%99%AE%E5%90%89_%E5%8B%9D%E5%88%A93.mp3'
},{
	ZH: 'PUGWRRRRRYYYYYYYYY！',
	EN: 'PUGWRRRRRYYYYYYYYY!',
	JP: 'プギWRRRRRYYYYYYYYY！',
}]

function ping(msg, bot) {
	if (rcv.test(msg.content.toLowerCase()) ||
	    msg.mentions.members.has(bot.user.id)) {
		let tar = util.random(ans2)
		tar = util.random([ans1, ans1, ans1, tar])
		audio = tar.audio ? new Attachment(tar.audio, 'PUGGI.MP3') : undefined
		msg.channel.send(util.getLangStr(msg, tar), audio)
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