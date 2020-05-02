const util = require('../util.js')
const config = require('../config.js')

const userSchema = require('../schemas/user.js')

function allow(msg, bot, db) {
	if (!msg.mentions.members.size) {
		msg.channel.send(`Invalid arguments. Usage: \`${config.prefix}allow [member]\``)
	} else msg.mentions.members.tap(member=>{
		if (member.user.bot) msg.channel.send(`不能接受機器人 (${member}) 。`, msg.channel)
		else if (member.roles.has(config.fanRole))
			msg.channel.send(`${member} 已經是雷亞粉絲。`, msg.channel)
		else {
			member.addRole(config.fanRole)
			let lang = msg.content.split(' ')[1]
			let channel = config.generalChannel
			config.languageRoles.forEach(e=>{
				if (lang === e.name) {
					member.addRole(e.role)
					channel = e.channel
				}
			})
			var incr = config.fanRoleExp
			let User = db.model('User', userSchema)
			User.findOneAndUpdate({userId: member.id}, {$inc: {exp: incr}},
				{upsert: true, new: true}, (err,doc)=>{
				if (err) util.debugSend(`Update Users error: ${err}`, msg.channel)
				else util.debugSend(`${member} 經驗值增加了${incr}，目前經驗值為${doc.exp}。`, msg.channel)
			})
			bot.channels.get(channel).send(`恭喜 ${member} 成為雷亞粉絲！`)
		}
	})
}


module.exports = function(bot, db) {
	bot.on('message', msg => {
		util.tryCatch(()=>{
			if (util.cmd(msg, 'allow'))
				if (util.checkAdmin(msg) && util.checkChannel(msg))
					allow(msg, bot, db)
		}, bot)
	})
}