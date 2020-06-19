const util = require('../util.js')
const config = require('../config.js')

function clear(ch, bot) {
	ch.messages.fetch({ limit: 20 }).then(messages=>{
		util.tryCatch(()=>{
			try { ch.bulkDelete(messages) }
			catch { messages.each(message=>message.delete()) }
		}, bot)
	})
}

module.exports = function(bot) {
	bot.on('message', msg => {
		util.tryCatch(()=>{
			// Ignore bot messages.
			if (msg.author.bot) return
			// clear, only for debug channel
			if (util.is(msg.channel.id, [config.dbgChannel, '707889663410569236']))
				if (util.cmd(msg, 'clear')) clear(msg.channel, bot)
		}, bot)
	})
}