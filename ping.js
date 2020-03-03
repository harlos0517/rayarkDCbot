const util = require('./util.js')
const config = require('./config.js')

function ping(msg) {
	if (msg.content === 'puggi')
		msg.channel.send('puggi')
}

module.exports = function(bot) {
	bot.on('message', msg => {
		// Ignore bot messages.
		if (msg.author.bot) return
		// use is instead of checkChannel to avoid report
		if (util.is(msg.channel.id, config.availChannels))
			ping(msg)
	})
}