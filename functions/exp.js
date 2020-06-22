const util = require('../util.js')
const config = require('../config.js')

const userSchema = require('../schemas/user.js')
const channelSchema = require('../schemas/channel.js')

function level(exp) {
	if (exp < 50000)
		return Math.max(0, Math.floor(exp/5000))
	else if (exp < 10000000) {
		let expNeed = 50000
		for (let lv=11; lv<=100; lv++) {
			expNeed += Math.round(380*(lv-11)/83.888 + 20) * 500
			if (exp < expNeed) return lv-1
		}
	} else return Math.floor((exp-10000000)/200000) + 100
}

function levelExp(level) {
	let exp = 0
	for (let i = 0; i < level; i++) {
		if (i < 10) exp += 5000
		else if (i < 100) exp += Math.round(380*(i-10)/83.888 + 20) * 500
		else exp += 200000
	}
	return exp
}

function checkLevelup(msg, bot, user, a, b) {
	if(level(b) > level(a))
		msg.channel.send(`恭喜 ${user} 升級到 ${level(b)} 等！`)
}

function addExp(msg, bot, db) {
	let Channel = db.model('Channel', channelSchema)
	Channel.findOne({channelId: msg.channel.id}, (err,doc)=>{
		if (err) util.debugSend('DB-error', `(addExp) Find Channels error: ${err}`, bot)
		else if (!doc || doc.expRatio <= 0) return
		else {
			var incr = msg.content.length * doc.expRatio
			let User = db.model('User', userSchema)
			User.findOneAndUpdate({userId: msg.author.id}, {$inc: {exp: incr}},
				{upsert: true, new: true}, (err,doc)=>{
				if (err) util.debugSend('DB-error', `(addExp) Update Users error: ${err}`, bot)
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
	if (!msg.mentions.members.size || isNaN(incr)) {
		msg.channel.send(`Invalid arguments. Usage: \`${config.prefix}exp add [EXP] [member]\` where EXP is a positive integer.`)
	} else msg.mentions.members.tap(member=>{
		if (member.user.bot) msg.channel.send(`不能對機器人 (${member}) 增加經驗值。`)
		else {
			let User = db.model('User', userSchema)
			User.findOneAndUpdate({userId: member.id}, {$inc: {exp: incr}},
				{upsert: true, new: true}, (err,doc)=>{
				if (err) msg.channel.send(`Update Users error: ${err}`)
				else {
					msg.channel.send(`${member} 經驗值增加了 ${incr}，目前經驗值為 ${doc.exp} 。`)
					checkLevelup(msg, bot, member, doc.exp-incr, doc.exp)
				}
			})
		}
	})
}

function addExpToId(msg, bot, db) {
	let words = msg.content.split(' ')
	var incr = Number(words[2])
	var id = words[3]
	console.log(id)
	if (isNaN(incr)) {
		msg.channel.send(`Invalid arguments. Usage: \`${config.prefix}exp add [EXP] [member]\` where EXP is an integer.`)
	} else bot.guilds.resolve(config.guildId).members.fetch(id).then(member=>{
		if (member.user.bot) msg.channel.send(`不能對機器人 (${member}) 增加經驗值。`)
		else {
			let User = db.model('User', userSchema)
			User.findOneAndUpdate({userId: member.id}, {$inc: {exp: incr}},
				{upsert: true, new: true}, (err,doc)=>{
				if (err) msg.channel.send(`Update Users error: ${err}`)
				else {
					msg.channel.send(`${id} 經驗值增加了 ${incr}，目前經驗值為 ${doc.exp} 。`)
					// checkLevelup(msg, bot, member, doc.exp-incr, doc.exp)
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
			if (err) msg.channel.send(`Update Channels error: ${err}`)
			else msg.channel.send(`成功更動 ${ch} 頻道經驗值比率為 ${doc.expRatio}。`)
		})
	})
}

function listChannelExp(msg, bot, db) {
	let Channel = db.model('Channel', channelSchema)
	Channel.find(async (err, docs)=>{
		if (err) msg.channel.send(`Find Channels error: ${err}`)
		else {
			var str = '**[ 各頻道經驗值比率列表 ]**\n'
			for (e of docs) {
				str += `${await bot.channels.fetch(e.channelId)} : ${e.expRatio}\n`
			}
			msg.channel.send(str)
		}
	})
}

async function addHistoryExp(orgMsg, channel, ratio, db) {
	let lastId = 0
	const max = 100
	let total = 0
	let options = { limit: max }
	let User = db.model('User', userSchema)

	while (true) {
		if (lastId) options.before = lastId
		const messages = await channel.messages.fetch(options)
		messages.each(msg=>{
			var incr = msg.content.length * ratio
			if (msg.author.bot) return
			User.findOneAndUpdate({ userId: msg.author.id }, { $inc: { exp: incr } },
				{ upsert: true, new: true }, err=>{
				if (err) util.debugSend('DB-error', `(addHistoryExp) Update Users error: ${err}`, orgMsg.channel)
			})
		})
		total += messages.size
		lastId = messages.last().id
		if (messages.size < max) break
	}
	return total
}

function initExp(msg, bot, db) {
	msg.channel.send(`[ WARNING ]  Use this only after you have reset EXP.`)
	config.expRoles.forEach(r=>{
		let incr = r.exp
		let guild = bot.guilds.resolve(config.guildId)
		Promise.all([
			guild.members.fetch(), // get all the members
			guild.roles.fetch(r.id)
		]).then(v=>{
			let role = v[1]
			msg.channel.send(`Adding ${incr} EXP to all ${r.name}.`)
			role.members.each(member=>{
				if (member.user.bot) return
				let User = db.model('User', userSchema)
				User.findOneAndUpdate({ userId: member.id }, { $inc: { exp: incr } },
					{ upsert: true }, err=>{
					if (err) util.debugSend('DB-error', `(initExp) Update Users error: ${err}`, msg.channel)
				})
			})
		})
	})

	// Search for history messages
	let Channel = db.model('Channel', channelSchema)
	Channel.find((err, docs)=>{
		if (err) msg.channel.send(`Find Channels error: ${err}`)
		else {
			for (e of docs) {
				let channel = bot.channels.fetch(e.channelId).then(ch)
				addHistoryExp(msg, channel, e.expRatio, db).then(total=>{
					msg.channel.send(`History exp added for channel ${channel}`)
				})
			}
		}
	})
}

function initReset(msg, bot, db) {
	let role = bot.guilds.resolve(config.guildId).roles.fetch(config.fanRole)
	let User = db.model('User', userSchema)
	User.collection.drop((err,res)=>{
		if (err) msg.channel.send(`Drop Users error: ${err}`)
		else msg.channel.send(`Exp reset.`)
	})
}

function showExp(msg, bot, db) {
	let target = msg.mentions.members.size ? msg.mentions.members.first() : msg.member
	let User = db.model('User', userSchema)
	User.find((err, docs)=>{
		if (err) msg.channel.send(`Find Users error: ${err}`)
		else {
			//set rank
			docs.sort((a,b)=>(b.exp - a.exp))
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
			let doc = docs.find(e=>e.userId === target.id)
			doc = doc || {exp: 0, rank: docs.length + 1}
			let str = `${target}\n`
			str += `[ **LV ${level(doc.exp)}** ]     `
			str += `**RANK ${doc.rank <= 3 ? `:small_orange_diamond:` : `:white_small_square:`}${doc.rank}**     `
			str += `EXP \`${`${doc.exp}`.padStart(8, ' ')}\`\n`
			let  curLevelExp = levelExp(level(doc.exp)  )
			let nextLevelExp = levelExp(level(doc.exp)+1)
			str += `Level Progress : \`${`${doc.exp - curLevelExp}`.padStart(8, ' ')} / `
			str += `${`${nextLevelExp - curLevelExp}`.padStart(8, ' ')}  `
			str += `( ${((doc.exp - curLevelExp) / (nextLevelExp - curLevelExp) * 100).toFixed(2).padStart(5, ' ')}% )\``
			msg.channel.send(str)
		}
	})
}

function showTop(msg, bot, db) {
	var page = Number(msg.content.split(' ')[2]) || 1
	let User = db.model('User', userSchema)
	User.find(async (err, docs)=>{
		if (err) msg.channel.send(`Find Users error: ${err}`)
		else {
			var str = `**[ 排行榜 ]** 頁 ${page}/${Math.ceil(docs.length/10)}\n`
			let guild = bot.guilds.resolve(config.guildId)
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
				for (e of sliced) {
					let member = await guild.members.fetch(e.userId).catch(()=>{})
					let substr = `${e.rank <= 3 ? `:small_orange_diamond:` : `:white_small_square:`}`
					substr += `**${e.rank}**   `
					substr += `[ **LV ${level(e.exp)}** ]  `
					if (member)
						substr += `${member.nickname ? member.nickname : member.user.username}`
					else {
						try {
							let user = await bot.users.fetch(e.userId)
							substr += `${user.username} *(已離開)*`
						} catch {
							substr += '*(帳號已刪除)*'
						}
					}
					str += substr + '\n'
				}
				msg.channel.send(str)
			} else msg.channel.send(`頁碼超出範圍。總頁數為 ${Math.ceil(docs.length/10)}`)
		}
	})
}

module.exports = function(bot, db) {
	bot.on('message', msg => {
		// Ignore bot messages and non-guild messages.
		if (!util.checkMember(msg)) return

		// add exp auto
		if (msg.channel.type === 'text') addExp(msg, bot, db)

		let cmd = util.cmd(msg)
		if (!cmd) return
		if (cmd[0] === 'exp') {
			// set channel exp ratio
			if (cmd[1] === 'setRatio')
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					setChannelExp(msg, bot, db)

			// list exp ratio
			if (cmd[1] === 'showRatio')
				if (util.checkChannel(msg))
					listChannelExp(msg, bot, db)

			// init exp
			if (cmd[1] === 'init')
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					initExp(msg, bot, db)

			// reset exp
			if (cmd[1] === 'reset')
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					initReset(msg, bot, db)

			// add exp manual
			if (cmd[1] === 'add')
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					addExpTo(msg, bot, db)

			// add exp manual2
			if (cmd[1] === 'addById')
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					addExpToId(msg, bot, db)

			// show exp
			if (cmd[1] === 'show')
				if (util.checkChannel(msg))
					showExp(msg, bot, db)

			// show top users
			if (cmd[1] === 'top')
				if (util.checkChannel(msg))
					showTop(msg, bot, db)
		}
	})
}