const Discord = require('discord.js')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const util = require('./util.js')
const config = require('./config.js')

const bot = new Discord.Client()

process.on('unhandledRejection', err=>{
	if (err.name === 'DiscordAPIError') util.debugSend('error',
		`${err.name} ${err.method} ${err.path}\n${err.code} - ${err.message}`, bot)
	else util.debugSend('error', err, bot)
})

process.on('uncaughtException', err => {
  util.debugSend('error', err, bot)
})

process.on('warning', warning=>{
  util.debugSend('warn', warning, bot)
})

process.on('SIGINT', async ()=>{
	await util.debugSend('info', `普吉晚安！ Puggi good night!`, bot)
	process.exit()
})

process.on('SIGTERM', async ()=>{
	await util.debugSend('info', `普吉晚安！ Puggi good night!`, bot)
	process.exit()
})

// connect to mongoDB when bot is ready
bot.once('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`)
	mongoose.set('useNewUrlParser', true)
	mongoose.set('useUnifiedTopology', true)
	mongoose.set('useFindAndModify', false)
	mongoose.set('useCreateIndex', true)
	mongoose.connect(process.env.DBURL, (err)=>{
		if (err) util.debugSend('DB-error', `MongoDB connection error: ${err}`, bot)
		else util.debugSend('DB-info', 'Connected to MongoDB successfully.', bot)
	})

	util.debugSend('info', `普吉起床了！ Puggi wakes up!`, bot)
})

bot.on('guildMemberRemove', member=>{
	channel = bot.guilds.resolve(config.guildId).systemChannelID
	bot.channels.fetch(channel).then(ch=>{
		ch.send(`${member} has left ${config.guildName}.`)
	})
})

require('./debug.js')(bot)

require('./functions/ping.js')(bot)
require('./functions/setrole.js')(bot, mongoose)
require('./functions/count.js')(bot)
require('./functions/clear.js')(bot)
require('./functions/exp.js')(bot, mongoose)
require('./functions/iam.js')(bot)
require('./functions/fb.js')(bot)
require('./functions/channel.js')(bot)

// login
bot.login(process.env.TOKEN)
