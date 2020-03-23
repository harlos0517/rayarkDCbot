const prefix     = '!'
const guildId    = '658648174784937985'
const spmChannel = '676067274666410034'
const cmdChannel = '674911470785658880'
const dbgChannel = '684259321403801630'
const generalChannel = '658648174784937988'
const adminRole  = '674893692015869972'
const fanRole    = '676069780947599371'

module.exports = {
	prefix: prefix,
	guildId: guildId,
	spmChannel: spmChannel,
	cmdChannel: cmdChannel,
	dbgChannel: dbgChannel,
	availChannels: [spmChannel, cmdChannel, dbgChannel],
	generalChannel: generalChannel,
	adminRole: adminRole,
	fanRole: fanRole,
	fanRoleExp: 20000,
	fanpages: [{
		id: 'rayark.inc',
		channel: '674897826588786695',
		pinRole: '691530850570993664'
	},{
		id: 'rayark.mandora',
		channel: '674892202643685376',
		pinRole: '691530836364754994'
	},{
		id: 'rayark.cytus',
		channel: '674892097395884042',
		pinRole: '691527455986548768'
	},{
		id: 'rayark.deemo',
		channel: '674892439630249984',
		pinRole: '691530842388037652'
	},{
		id: 'rayark.voez',
		channel: '674979924494385152',
		pinRole: '691530846049665074'
	},{
		id: 'rayark.sdorica',
		channel: '674892179889586207',
		pinRole: '691530847479660545'
	},{
		id: 'MOAstray',
		channel: '674892417543176192',
		pinRole: '691530848360464414'
	},{
		id: 'rayark.implosion',
		channel: '674892241059446805',
		pinRole: '691530848977158194'
	},{
		id: 'rayark.soulofeden',
		channel: '674892516612505600',
		pinRole: '691530849765818398'
	},{
		id: 'RayarkConcept',
		channel: '691533621483274260',
		pinRole: '691534019631775785'
	}],
	iamRoles: [{
		name: 'Rayark',
		abbr: 'rayark',
		role: '691530850570993664'
	},{
		name: 'Mandora',
		abbr: 'mandora',
		role: '691530836364754994'
	},{
		name: 'Cytus',
		abbr: 'cytus',
		role: '691527455986548768'
	},{
		name: 'Deemo',
		abbr: 'deemo',
		role: '691530842388037652'
	},{
		name: 'Voez',
		abbr: 'voez',
		role: '691530846049665074'
	},{
		name: 'Sdorica',
		abbr: 'sdorica',
		role: '691530847479660545'
	},{
		name: 'MO Astray',
		abbr: 'mo',
		role: '691530848360464414'
	},{
		name: 'Implosion',
		abbr: 'implosion',
		role: '691530848977158194'
	},{
		name: 'Soul of Eden',
		abbr: 'soe',
		role: '691530849765818398'
	},{
		name: 'Rayark Concept',
		abbr: 'concept',
		role: '691534019631775785'
	}]
}