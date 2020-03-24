const request = require('request')
const cheerio = require('cheerio')
const urlRegex = require('url-regex')

const util = require('../util.js')
const config = require('../config.js')

const root = 'https://www.facebook.com'
const posts = '/posts'
const topSelector = '#pagelet_timeline_main_column ._4-u2._4-u8 ._449j'
const linkSelector = '#pagelet_timeline_main_column ._4-u2._4-u8 .fsm.fwn.fcg a._5pcq'
const previewSelector = '#pagelet_timeline_main_column ._4-u2._4-u8 ._5pbx.userContent._3576'
const interval = 600000

function fetchPage(fanpage, bot) {
	request({
		url: `${root}/${fanpage.id}${posts}`,
		headers: { 'User-Agent': 'request' }
	}, (err, res, body)=>{
		util.tryCatch(()=>{
			const $ = cheerio.load(body)
			let i = $(topSelector).get().length
			let link = root + $($(linkSelector).get(i)).attr('href').split('?')[0]
			let preview = $($(previewSelector).get(i))
			preview.find('.text_exposed_hide').remove()
			preview.find('p').append('<br>')
			preview.find('br').replaceWith('\n')
			preview = preview.text()
			preview = preview.replace(/\\/g, '\\\\')
			preview = preview.replace(/\`/g, '\\\`')
			preview = preview.replace(/\*/g, '\\\*')
			preview = preview.replace(/\|/g, '\\\|')
			preview = preview.replace(/\~/g, '\\\~')
			preview = preview.replace(/\_/g, '\\\_')
			preview = preview.replace(/\</g, '\\\<')
			preview = preview.replace(/\>/g, '\\\>')
			preview = preview.replace(/\#/g, '\\\#')
			preview = preview.replace(/\@/g, '\\\@')
			preview = preview.replace(urlRegex(), m=>`<${m}>`)
			if (fanpage.cur && fanpage.cur !== link)
				bot.channels.get(fanpage.channel)
					.send(`${bot.guilds.get(config.guildId).roles.get(fanpage.pinRole)}\n** ${link} **\n${preview}`)
				// bot.channels.get(config.dbgChannel)
				// 	.send(`** ${link} **\n${preview}`)
			fanpage.cur = link
		}, bot)
	})
}

function fetchPages(bot) {
	config.fanpages.forEach(fanpage=>{ fetchPage(fanpage, bot) })
}

function facebookFeed(bot) {
	util.tryCatch(()=>{
		fetchPages(bot)
		setInterval(()=>{ fetchPages(bot) }, interval)
	}, bot)
}

module.exports = facebookFeed