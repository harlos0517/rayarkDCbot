const util = require('./util.js')
const config = require('./config.js')
const events = [
	'channelCreate',
	'channelDelete',
	'channelPinsUpdate',
	'channelUpdate',
	'clientUserGuildSettingsUpdate',
	'clientUserSettingsUpdate',
	'debug',
	'disconnect',
	'emojiCreate',
	'emojiDelete',
	'emojiUpdate',
	'error',
	'guildBanAdd',
	'guildBanRemove',
	'guildCreate',
	'guildDelete',
	'guildIntegrationsUpdate',
	'guildMemberAdd',
	'guildMemberAvailable',
	'guildMemberRemove',
	'guildMembersChunk',
	'guildMemberSpeaking',
	'guildMemberUpdate',
	'guildUnavailable',
	'guildUpdate',
	'message',
	'messageDelete',
	'messageDeleteBulk',
	'messageReactionAdd',
	'messageReactionRemove',
	'messageReactionRemoveAll',
	'messageUpdate',
	'presenceUpdate',
	'rateLimit',
	'ready',
	'reconnecting',
	'resume',
	'roleCreate',
	'roleDelete',
	'roleUpdate',
	'typingStart',
	'typingStop',
	'userNoteUpdate',
	'userUpdate',
	'voiceStateUpdate',
	'warn',
	'webhookUpdate'
]

function debugLog(event, str) {
	console.log(`[ ${event} ]${str?`  ${str}`:''}`)
}

function debug(bot) {
	util.tryCatch(()=>{
		events.forEach(event=>{
			if (event === 'debug') {
				bot.on(event, (info)=>{ debugLog('debug', info) })
			} else bot.on(event, ()=>{ debugLog(event) })
		})
	}, bot)
}

module.exports = debug