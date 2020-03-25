const Embed = require('discord.js').RichEmbed
const request = require('request')
const cheerio = require('cheerio')
const urlRegex = require('url-regex')

const util = require('../util.js')
const config = require('../config.js')

const root = 'https://www.facebook.com'

const selector = {
	post: '#pagelet_timeline_main_column ._1dwg._1w_m._q7o',
	top: '._449j',
	link: '.fsm.fwn.fcg a._5pcq',
	caption: '._6a._5u5j._6b>h5 .fwn.fcg',
	content: '._5pbx.userContent._3576',
	image: 'img.scaledImageFitWidth',
	headpic: 'img._s0._4ooo._5xib._5sq7._44ma._rw.img'
}

const interval = 600000

function fetchPage(fanpage, bot) {
	request({
		url: `${root}/${fanpage.id}/posts`,
		headers: { 'User-Agent': 'request' }
	}, (err, res, body)=>{
		util.tryCatch(()=>{
			const $ = cheerio.load(body)
			let posts = $(selector.post)
			let i = 0
			while($(posts.get(i)).find(selector.top).length) i++
			let post = $(posts.get(i))
			let link = root + post.find(selector.link).attr('href').split('?')[0]
			if (fanpage.cur && fanpage.cur !== link) {
				let caption = post.find(selector.caption).text()
				let image = post.find(selector.image).attr('src')
				let headpic = post.find(selector.headpic).attr('src')
				let content = post.find(selector.content)
				content.find('.text_exposed_hide').remove()
				content.find('p').append('<br>')
				content.find('br').replaceWith('\n')
				content = content.text()
				content = content.replace(/\\/g, '\\\\')
				content = content.replace(/\`/g, '\\\`')
				content = content.replace(/\*/g, '\\\*')
				content = content.replace(/\|/g, '\\\|')
				content = content.replace(/\~/g, '\\\~')
				content = content.replace(/\_/g, '\\\_')
				content = content.replace(/\</g, '\\\<')
				content = content.replace(/\>/g, '\\\>')
				content = content.replace(/\#/g, '\\\#')
				content = content.replace(/\@/g, '\\\@')
				content = content.replace(urlRegex(), m=>`<${m}>`)
				const embed = new Embed()
					.setColor('#3578E5')
					.setTitle(caption)
					.setURL(link)
					.setAuthor(`${fanpage.name} (Facebook)`, headpic, `${root}/${fanpage.id}`)
					.setDescription(content)
					.setImage(image)
					// .setTimestamp()
				bot.channels.get(fanpage.channel)
					.send(`${bot.guilds.get(config.guildId).roles.get(fanpage.pinRole)}`,
						{embed: embed})
				// bot.channels.get(config.dbgChannel)
				// 	.send('\@TEST', {embed: embed})
			}
			fanpage.cur = link
		}, bot)
	})
}

function fetchPages(bot) {
	config.fanpages.forEach(fanpage=>{ fetchPage(fanpage, bot) })
	// fetchPage(config.fanpages[7], bot)
}

function facebookFeed(bot) {
	util.tryCatch(()=>{
		fetchPages(bot)
		setInterval(()=>{ fetchPages(bot) }, interval)
	}, bot)
}

module.exports = facebookFeed