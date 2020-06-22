const util = require('../util.js')
const config = require('../config.js')

function setRole(msg, args, tog) {
	let member = msg.member
	args.forEach(arg=>{
		let role = config.userRoles.find(role=>role.abbr === arg)
		if (!role) 
			return msg.channel.send(`Role ${arg} not found.`)
		if (tog) {
			member.roles.add(role.id)
				.catch(err=>util.catch(`(iam) ` + err, msg.channel))
			msg.channel.send(`${member} added ${role.name} role.`)
		} else {
			member.roles.remove(role.id)
				.catch(err=>util.catch(`(iamnot) ` + err, msg.channel))
			msg.channel.send(`${member} removed ${role.name} role.`)
		}
	})
}

module.exports = function(bot, db) {
	bot.on('message', msg => {
		if (!util.checkMember(msg)) return
		let cmd = util.cmd(msg)
		if (!cmd) return
		if (cmd[0] === 'iam')
			if (util.checkChannel(msg))
				setRole(msg, cmd.slice(1), true )
		if (cmd[0] === 'iamnot')
			if (util.checkChannel(msg))
				setRole(msg, cmd.slice(1), false)
	})
}