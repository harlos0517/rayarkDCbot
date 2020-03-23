const util = require('../util.js')
const config = require('../config.js')

function setRole(msg, role, tog) {
	let member = msg.member
	if (tog) {
		member.addRole(role.role)
		msg.channel.send(`${member} 已訂閱 ${role.name}。`)
	} else {
		member.removeRole(role.role)
		msg.channel.send(`${member} 已取消訂閱 ${role.name}。`)
	}
}

module.exports = function(bot, db) {
	bot.on('message', msg => {
		util.tryCatch(()=>{
			// Ignore bot messages.
			if (msg.author.bot) return
			config.iamRoles.forEach(e=>{
				if (util.cmd(msg, `iam ${e.abbr}`))
					if (util.checkChannel(msg))
						setRole(msg, e, true )
				if (util.cmd(msg, `iamnot ${e.abbr}`))
					if (util.checkChannel(msg))
						setRole(msg, e, false)
			})
		}, bot)
	})
}