const util = require('../util.js')
const fs = require('fs')

const config = require('../config.js')

function setChannel(bot, ch, cat) {
	let topic = ``
	let channel = bot.channels.fetch(ch.id)
	channel.setName(ch.name)
	let str = `\t:small_orange_diamond: `
	str += (channel.type==='voice') ? `**:sound:${ch.name}**` : `**${channel}**`
	if (ch.topic.ZH && ch.topic.ZH.length > 0){
		str += `\n\t\t\t\t*${ch.topic.ZH.replace(/\n/g, '  ')}*`
		topic += `${ch.topic.ZH}`
		if (ch.warning && ch.warning.ZH) {
			str   += ` ***:warning:${ch.warning.ZH}***`
			topic += ` ***:warning:${ch.warning.ZH}***\n`
		} else topic += '\n'
	}
	if (ch.topic.EN && ch.topic.EN.length > 0){
		str += `\n\t\t\t\t*${ch.topic.EN.replace(/\n/g, '  ')}*`
		topic += `${ch.topic.EN}`
		if (ch.warning && ch.warning.EN) {
			str   += ` ***:warning:${ch.warning.EN}***`
			topic += ` ***:warning:${ch.warning.EN}***\n`
		} else topic += '\n'
	}
	if (ch.topic.JP && ch.topic.JP.length > 0){
		str += `\n\t\t\t\t*${ch.topic.JP.replace(/\n/g, '  ')}*`
		topic += `${ch.topic.JP}`
		if (ch.warning && ch.warning.JP) {
			str   += ` ***:warning:${ch.warning.JP}***`
			topic += ` ***:warning:${ch.warning.JP}***\n`
		} else topic += '\n'
	}
	str += '\n'
	if (channel.setTopic) channel.setTopic(topic)
	return str
}

function channelSetup(bot) {
	let guide = bot.channels.fetch('707889663410569236')
	let channels = require('./channels.json')
	let str = '**[ 頻道導覽 ]**\n'
	guide.send(str)

	channels.forEach(cat=>{
		if (cat.type !== 'category') guide.send(setChannel(bot, cat, cat))
		else {
			let str = `:white_small_square: **${cat.name}**\n`
			let category = bot.channels.fetch(cat.id)
			category.setName(cat.name)
			cat.channels.forEach((ch)=>{
				str += setChannel(bot, ch, cat)
			})
			guide.send(str)
		}
	})
}

module.exports = function(bot) {
	bot.on('message', msg => {
		util.tryCatch(()=>{
			if (util.cmd(msg, 'channel setup'))
				if (util.checkChannel(msg))
					channelSetup(bot)
		}, bot)
	})
}