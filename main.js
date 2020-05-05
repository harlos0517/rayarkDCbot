const events = require('events')
const { exec } = require('child_process')
const Discord = require('discord.js')
const mongoose = require('mongoose')

const auth = require('./auth.json')
const util = require('./util.js')
const config = require('./config.js')

const bot = new Discord.Client()

function trim(str) {
	let lines = str.split('\n')
	let sections = []
	let i = 0
	let section = ''
	while (true) {
		if (i>=lines.length) {
			sections.push(section)
			return sections
		}
		let thisLine = lines[i]
		if (thisLine.length > 1500)
			thisLine = thisLine.slice(0,1496)+'...'
		if (section.length + thisLine.length > 1500) {
			sections.push(section)
			section = ''
		}
		if (section != '') section += '\n'
		section += thisLine
		i++
	}
}

// connect to mongoDB when bot is ready
bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}!`)
	mongoose.set('useNewUrlParser', true)
	mongoose.set('useUnifiedTopology', true)
	mongoose.set('useFindAndModify', false)
	mongoose.set('useCreateIndex', true)
	mongoose.connect(auth.dbUrl, (err)=>{
		if (err) console.error(`MongoDB connection error: ${err}`)
		else console.log('Connected to MongoDB successfully.')
	})

	util.debugSend(`Puggi wakes up!`, bot)
})

bot.on('message', msg => {
	util.tryCatch(()=>{
		// Ignore bot messages.
		if (msg.author.bot) return
		// restart command
		if (util.cmd(msg, 'restart')) {
			if (util.checkAdmin(msg) && util.checkChannel(msg)) {
				util.debugSend(`Puggi goes to sleep.`, bot)
				setTimeout(()=>{
					bot.destroy()
					exec('node main.js rayark', (err,stdout,stderr)=>{
						if (err) console.error(err)
						else process.exit(0)
					})
				}, 1000)
			}
		}
		// git command
		if (util.cmd(msg, 'git')) {
			if (util.checkAdmin(msg) && util.checkChannel(msg)) {
				var git = exec(msg.content.slice(2), {
					timeout: 15000
				}, (err, stdout, stderr)=>{
					if (err && err.length) msg.channel.send(err)
				})
				git.stdout.on('data', data=>{
					trim(data).forEach(sec=>{
						msg.channel.send(`\`\`\`bash\n${sec}\`\`\``)
					})
				})
				git.stderr.on('data', data=>{
					trim(data).forEach(sec=>{
						msg.channel.send(`\`\`\`bash\n${sec}\`\`\``)
					})
				})
				git.on('close', code=>{
					msg.channel.send(`\`exited(${Number(code)})\``)
				})
			}
		}
	}, bot)
})

require('./debug.js')(bot)
require('./ping.js')(bot)

require('./functions/allow.js')(bot, mongoose)
require('./functions/count.js')(bot)
require('./functions/clear.js')(bot)
require('./functions/exp.js')(bot, mongoose)
require('./functions/iam.js')(bot)
require('./functions/fb.js')(bot)
require('./functions/channel.js')(bot)

// login
bot.login(auth.token)