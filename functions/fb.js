const Embed = require('discord.js').RichEmbed
const request = require('request')
const cheerio = require('cheerio')
const urlRegex = require('url-regex')

const util = require('../util.js')
const config = require('../config.js')

const DEBUG = false

const root = 'https://www.facebook.com'

const selector = {
	post: '#pagelet_timeline_main_column ._1dwg._1w_m._q7o',
	top: '._449j',
	link: '.fsm.fwn.fcg a._5pcq',
	caption: '._6a._5u5j._6b>h5 .fwn.fcg',
	content: '._5pbx.userContent._3576',
	image: 'img.scaledImageFitWidth',
	video: '._3chq',
	headpic: 'img._s0._4ooo._5xib._5sq7._44ma._rw.img',
	timestamp: '._6a._5u5j._6b abbr._5ptz'
}

const interval = 1800000

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
			let checkElement = function (ele, eleName) {
				if (!ele.length) {
					util.debugSend(`[ ERROR ] fetchPage() : ${eleName} element not found! Fanpage : ${fanpage.name}`, bot)
					return false
				} else return true
			}
			// check timestamp
			let timestamp = post.find(selector.timestamp)
			if (!checkElement(timestamp, 'timestamp')) return
			let utime = timestamp.attr('data-utime') || 0
			if ((fanpage.updateTime && utime > fanpage.updateTime) || DEBUG) {
				let link = post.find(selector.link).attr('href')
				checkElement(link, 'link')
				link = root + link.split('?')[0]
				let caption = post.find(selector.caption).text()
				let image = post.find(selector.image).attr('src') ||
					post.find(selector.video).attr('src') || ''
				let headpic = post.find(selector.headpic).attr('src')
				// handle content
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
				if (content.length > 1024)
					content = content.slice(0,1024) + '...'
				const embed = new Embed()
					.setColor('#3578E5')
					.setTitle(caption)
					.setURL(link)
					.setAuthor(`${fanpage.name} (Facebook)`, headpic, `${root}/${fanpage.id}`)
					.setDescription(content)
					.setImage(image)
					.setTimestamp(utime*1000)
				if (!DEBUG) {
					bot.channels.get(fanpage.channel)
						.send(`${bot.guilds.get(config.guildId).roles.get(fanpage.pinRole)}`,
							{embed: embed})
				} else {
					bot.channels.get(config.dbgChannel)
						.send('\@TEST', {embed: embed})
				}
			}
			fanpage.updateTime = utime
		}, bot, `Fanpage : ${fanpage.name}`)
	})
}

function fetchPages(bot) {
	let now = new Date(Date.now())
	if (now.getHours() < 9 || now.getHours > 22) return
	util.debugSend('Fetching Facebook posts...', bot)
	if (!DEBUG) config.fanpages.forEach(fanpage=>{ fetchPage(fanpage, bot) })
	else fetchPage(config.fanpages[0], bot)
}

function facebookFeed(bot) {
	bot.on('ready', () => {
		util.tryCatch(()=>{
			fetchPages(bot)
			let now = Date.now()
			let curMs = now % interval
			let waitms = (interval + 60000 - curMs) % interval
			bot.setTimeout(()=>{
				fetchPages(bot)
				bot.setInterval(()=>{ fetchPages(bot) }, interval)
			}, waitms)
		}, bot)
	})
}

module.exports = facebookFeed