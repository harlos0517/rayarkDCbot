const util = require('../util.js')
const config = require('../config.js')

function clearInterval(chId, bot) {
	let ch = bot.channels.cache.get(chId)
	bot.setInterval(()=>{
		util.tryCatch(async ()=>{
			let time = new Date()
			let messages
			do {
				messages = await ch.messages.fetch({ limit: 20 })
				filtered = messages.filter(message=>message.createdTimestamp < time.getTime() - 604800000)
				ch.bulkDelete(filtered)
			} while (filtered.size)
		}, bot)
	}, 3600000);
}

function clear(ch, bot) {
	ch.messages.fetch({ limit: 20 }).then(messages=>{
		util.tryCatch(()=>{
			try { ch.bulkDelete(messages) }
			catch { messages.each(message=>message.delete()) }
		}, bot)
	})
}

module.exports = function(bot) {
	bot.once('ready', () => {
		clearInterval(config.dbgChannel, bot)
	})

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