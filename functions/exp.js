const util = require('../util.js')
const config = require('../config.js')

const userSchema = require('../schemas/user.js')
const channelSchema = require('../schemas/channel.js')

function level(exp) {
	if (exp < 20000)
		return Math.max(0, Math.floor(exp/2000))
	else if (exp < 6000000) {
		let expNeed = 20000
		for (let lv=11; lv<=100; lv++) {
			expNeed += Math.round(990 * Math.pow((lv-10)/91.84,2) + 10) * 200
			if (exp < expNeed) return lv-1
		}
	} else return Math.floor((exp-6000000)/200000) + 100
}

function checkLevelup(msg, bot, user, a, b) {
	if(level(b) > level(a))
		msg.channel.send(`恭喜 ${user} 升級到 ${level(b)} 等！`)
}

function addExp(msg, bot, db) {
	let Channel = db.model('Channel', channelSchema)
	Channel.findOne({channelId: msg.channel.id}, (err,doc)=>{
		if (err) util.debugSend(`Find Channels error: ${err}`, bot.channels.get(config.dbgChannel))
		else if (!doc || doc.expRatio <= 0) return
		else {
			var incr = msg.content.length * doc.expRatio
			let User = db.model('User', userSchema)
			User.findOneAndUpdate({userId: msg.author.id}, {$inc: {exp: incr}},
				{upsert: true, new: true}, (err,doc)=>{
				if (err) util.debugSend(`Update Users error: ${err}`, bot.channels.get(config.dbgChannel))
				else {
					if (msg.channel.id === config.dbgChannel)
						msg.channel.send(`${msg.author} 經驗值增加了${incr}，目前經驗值為${doc.exp}。`)
					checkLevelup(msg, bot, msg.author, doc.exp-incr, doc.exp)
				}
			})
		}
	})
}

function addExpTo(msg, bot, db) {
	let words = msg.content.split(' ')
	var incr = Number(words[2])
	if (!msg.mentions.members.size || !(incr > 0)) {
		msg.channel.send(`Invalid arguments. Usage: \`${config.prefix}exp add [EXP] [member]\` where EXP is a positive integer.`)
	} else msg.mentions.members.tap(member=>{
		if (member.user.bot) util.debugSend(`不能對機器人 (${member}) 增加經驗值。`, msg.channel)
		else {
			let User = db.model('User', userSchema)
			User.findOneAndUpdate({userId: member.id}, {$inc: {exp: incr}},
				{upsert: true, new: true}, (err,doc)=>{
				if (err) util.debugSend(`Update Users error: ${err}`, msg.channel)
				else {
					util.debugSend(`${member} 經驗值增加了 ${incr}，目前經驗值為 ${doc.exp} 。`, msg.channel)
					checkLevelup(msg, bot, member, doc.exp-incr, doc.exp)
				}
			})
		}
	})
}

function setChannelExp(msg, bot, db) {
	var words = msg.content.split(' ')
	var r = Number(words[2])
	if (!msg.mentions.channels.size || !(r>=0 && r<1000)) {
		msg.channel.send(`Invalid arguments. Usage: \`${config.prefix}exp setRatio [ratio] [channels]\` where ratio is a non negative integer less than 1000`)
	} else msg.mentions.channels.tap(ch => {
		let Channel = db.model('Channel', channelSchema)
		Channel.findOneAndUpdate({channelId: ch.id}, {expRatio: r},
			{upsert: true, new: true}, (err,doc)=>{
			if (err) util.debugSend(`Update Channels error: ${err}`, msg.channel)
			else util.debugSend(`成功更動 ${ch} 頻道經驗值比率為 ${doc.expRatio}。`, msg.channel)
		})
	})
}

function listChannelExp(msg, bot, db) {
	let Channel = db.model('Channel', channelSchema)
	Channel.find((err, docs)=>{
		if (err) util.debugSend(`Find Channels error: ${err}`, bot.channels.get(config.dbgChannel))
		else {
			var str = '**[ 各頻道經驗值比率列表 ]**\n'
			docs.forEach((e,i,a)=>{
				str += `${bot.channels.get(e.channelId)} : ${e.expRatio}\n`
			})
			msg.channel.send(str)
		}
	})
}

function initExp(msg, bot, db) {
	msg.channel.send(`Warning : Use this only once, unless you have reset EXP.`)

	var incr = config.fanRoleExp
	let role = bot.guilds.get(config.guildId).roles.get(config.fanRole)
	msg.channel.send(`Adding ${incr} EXP to all ${role.name}. Check console for details and errors.`)
	role.members.tap(member=>{
		if (member.user.bot) return
		let User = db.model('User', userSchema)
		User.findOneAndUpdate({userId: member.id}, {$inc: {exp: incr}},
			{upsert: true, new: true}, (err,doc)=>{
			if (err) util.debugSend(`Update Users error: ${err}`, msg.channel)
			else console.log(`> ${member.user.tag} + ${incr} EXP => ${doc.exp} EXP.`)
		})
	})

	var incr2 = 2000
	let role2 = bot.guilds.get(config.guildId).roles.get('684789134832697347')
	msg.channel.send(`Adding ${incr2} EXP to all ${role2.name}. Check console for details and errors.`)
	role2.members.tap(member=>{
		if (member.user.bot) return
		let User = db.model('User', userSchema)
		User.findOneAndUpdate({userId: member.id}, {$inc: {exp: incr2}},
			{upsert: true, new: true}, (err,doc)=>{
			if (err) util.debugSend(`Update Users error: ${err}`, msg.channel)
			else console.log(`> ${member.user.tag} + ${incr2} EXP => ${doc.exp} EXP.`)
		})
	})

	let User = db.model('User', userSchema)
	User.findOneAndUpdate({userId: '600227019929813004'}, {$inc: {exp: 10000}},
		{upsert: true, new: true}, (err,doc)=>{
		if (err) util.debugSend(`Update Users error: ${err}`, msg.channel)
		else console.log(`> 600227019929813004 + ${10000} EXP => ${doc.exp} EXP.`)
	})
}

function initReset(msg, bot, db) {
	let role = bot.guilds.get(config.guildId).roles.get(config.fanRole)
	let User = db.model('User', userSchema)
	User.collection.drop((err,res)=>{
		if (err) util.debugSend(`Drop Users error: ${err}`, msg.channel)
		else util.debugSend(`Exp reset.`, msg.channel)
	})
}

function showExp(msg, bot, db) {
	let target = msg.mentions.members.size ? msg.mentions.members.first() : msg.member
	let User = db.model('User', userSchema)
	User.findOne({userId: target.id}, (err,doc)=>{
		if (err) util.debugSend(`Find Users error: ${err}`, msg.channel)
		else msg.channel.send(`${target} 目前 ${level(doc.exp)} 等，有 ${doc?doc.exp:0} 經驗值。`)
	})
}

function showTop(msg, bot, db) {
	var page = Number(msg.content.split(' ')[2]) || 1
	let User = db.model('User', userSchema)
	User.find((err, docs)=>{
		if (err) util.debugSend(`Find Users error: ${err}`, bot.channels.get(config.dbgChannel))
		else {
			var str = `**[ 排行榜 ]** 頁 ${page}/${Math.ceil(docs.length/10)}\n`
			let guild = bot.guilds.get(config.guildId)
			let start = (page - 1) * 10 + 0
			docs.sort((a,b)=>(b.exp - a.exp))
			//set rank
			var rank = 0
			var exp = -1
			docs.forEach((e,i,a)=>{
				if (exp === e.exp) e.rank = rank
				else {
					rank = i + 1
					exp = e.exp
					e.rank = rank
				}
			})
			let sliced = docs.slice(start,start + 10)
			if (sliced.length) {
				sliced.forEach(async(e,i,a)=>{
					let member = guild.members.get(e.userId)
					let substr = `${e.rank <= 3 ? `:small_orange_diamond:` : `:white_small_square:`}**${e.rank}** \\\| `
					substr += `**LV ${level(e.exp)}** | `
					if (member)
						substr += `**${member.user.tag}**${member.nickname ? ` aka **${member.nickname}**` : ''}`
					else {
						let user = await bot.fetchUser(e.userId)
						substr += user ? `${user.tag} *(已離開)*` : '*(帳號已刪除)*'
					}
					substr += ` ( ${e.exp} EXP )\n`
					str += substr
				})
				msg.channel.send(str)
			} else msg.channel.send(`頁碼超出範圍。總頁數為 ${Math.ceil(docs.length/10)}`)
		}
	})
}

module.exports = function(bot, db) {
	bot.on('message', msg => {
		util.tryCatch(()=>{
			// Ignore bot messages and non-guild messages.
			if (!util.checkMember(msg)) return

			// add exp auto
			if (util.is(msg.channel.type, ['text'])) addExp(msg, bot, db)

			// set channel exp ratio
			if (util.cmd(msg, 'exp setRatio'))
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					setChannelExp(msg, bot, db)

			// list exp ratio
			if (util.cmd(msg, 'exp showRatio'))
				if (util.checkChannel(msg))
					listChannelExp(msg, bot, db)

			// init exp
			if (util.cmd(msg, 'exp init'))
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					initExp(msg, bot, db)

			// reset exp
			if (util.cmd(msg, 'exp reset'))
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					initReset(msg, bot, db)

			// add exp manual
			if (util.cmd(msg, 'exp add'))
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					addExpTo(msg, bot, db)

			// show exp
			if (util.cmd(msg, 'exp show'))
				if (util.checkChannel(msg))
					showExp(msg, bot, db)

			// show top users
			if (util.cmd(msg, 'exp top'))
				if (util.checkChannel(msg))
					showTop(msg, bot, db)
		}, bot)
	})
}