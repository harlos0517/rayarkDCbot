module.exports = {
	prefix: process.env.NODE_ENV === 'production' ? '!' : '?',
	guildId: '658648174784937985',
	guildName: 'Rayark Village',
	expRate: 10,
	channels: {
		spam:  '676067274666410034',
		cmd:   '674911470785658880',
		debug: '723237787955888210',
	},
	expRoles: [{
		name: 'Admin',
		abbr: 'admin',
		id: '674893692015869972',
		exp: 0
	},{
		name: 'Rayark Fan',
		abbr: 'fan',
		id: '676069780947599371',
		exp: 600,
		welcome: true
	},{
		name: 'Promoters',
		abbr: 'promoter',
		id: '684789134832697347',
		exp: 300
	},{
		name: 'Contributors',
		abbr: 'contributor',
		id: '696513658833993729',
		exp: 5000
	},{
		name: 'Nitro Booster',
		abbr: 'nitro',
		id: '719210109275865111',
		exp: 5000
	}],
	userRoles: [{
		name: 'Rayark',
		abbr: 'rayark',
		id: '691530850570993664'
	},{
		name: 'Mandora',
		abbr: 'mandora',
		id: '691530836364754994'
	},{
		name: 'Cytus',
		abbr: 'cytus',
		id: '691527455986548768'
	},{
		name: 'Deemo',
		abbr: 'deemo',
		id: '691530842388037652'
	},{
		name: 'Voez',
		abbr: 'voez',
		id: '691530846049665074'
	},{
		name: 'Sdorica',
		abbr: 'sdorica',
		id: '691530847479660545'
	},{
		name: 'MO Astray',
		abbr: 'mo',
		id: '691530848360464414'
	},{
		name: 'Implosion',
		abbr: 'implosion',
		id: '691530848977158194'
	},{
		name: 'Soul of Eden',
		abbr: 'soe',
		id: '691530849765818398'
	},{
		name: 'Rayark Concept',
		abbr: 'concept',
		id: '691534019631775785'
	},{
		name: 'EN',
		abbr: 'en',
		id: '706135640013799465'
	},{
		name: 'ZH',
		abbr: 'zh',
		id: '706135737627836437'
	},{
		name: 'JP',
		abbr: 'jp',
		id: '706135728836444170'
	}],
	lang: [{
		name: 'EN',
		role: '706135640013799465',
		channel: {
			general: '687754264331943941'
		}
	},{
		name: 'ZH',
		role: '706135737627836437',
		channel: {
			general: '658648174784937988'
		}
	},{
		name: 'JP',
		role: '706135728836444170',
		channel: {
			general: '693754708220968991'
		}
	}],
	fanpages: [{
		name: 'Rayark',
		id: 'rayark.inc',
		channel: '806044176163930131',
		pinRole: '691530850570993664'
	},{
		name: 'Mandora',
		id: 'rayark.mandora',
		channel: '806044351623856128',
		pinRole: '691530836364754994'
	},{
		name: 'Cytus',
		id: 'rayark.cytus',
		channel: '806044325016109077',
		pinRole: '691527455986548768'
	},{
		name: 'Deemo',
		id: 'rayark.deemo',
		channel: '806044339959889930',
		pinRole: '691530842388037652'
	},{
		name: 'Voez',
		id: 'rayark.voez',
		channel: '806044548957601812',
		pinRole: '691530846049665074'
	},{
		name: 'Sdorica',
		id: 'rayark.sdorica',
		channel: '806044679505575957',
		pinRole: '691530847479660545'
	},{
		name: 'MO Astray',
		id: 'MOAstray',
		channel: '806044363959304192',
		pinRole: '691530848360464414'
	},{
		name: 'Implosion',
		id: 'rayark.implosion',
		channel: '806044730391396379',
		pinRole: '691530848977158194'
	},{
		name: 'Soul of Eden',
		id: 'rayark.soulofeden',
		channel: '806044396310364201',
		pinRole: '691530849765818398'
	},{
		name: 'Rayark Concept',
		id: 'RayarkConcept',
		channel: '806044268887932928',
		pinRole: '691534019631775785'
	}]
}
