const _ = require('lodash');
const characterSet = require('../configs/character-set');

module.exports = {
  battleStarted: {
    address: 0x01A79D88,
    offsets: [0xB40],
    type: 'int',
    size: null,
    valueTransformerOut: val => val > 1000000000, // This address points to another address, and the higher that address the more likely we are in battle
    valueTransformerIn: null
  },
  // Enemies in battle (4 slots)
  currentHealthEnemy1: {
    address: 0x01D27D98,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthEnemy1: {
    address: 0x01D27D9C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  isDeadEnemy1: {
    address: 0x01D27E00,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: val => val === 1,
    valueTransformerIn: null
  },
  displayNameEnemy1: {
    address: 0x01D75038,
    offsets: [],
    type: 'bytes',
    size: 14,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentStatusEnemy1: {
    address: 0x01D9749C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentHealthEnemy2: {
    address: 0x01D27E68,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthEnemy2: {
    address: 0x01D27E6C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  isDeadEnemy2: {
    address: 0x01D27ED0,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: val => val === 1,
    valueTransformerIn: null
  },
  displayNameEnemy2: {
    address: 0x01D75058,
    offsets: [],
    type: 'bytes',
    size: 14,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentStatusEnemy2: {
    address: 0x01D97538,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentHealthEnemy3: {
    address: 0x01D27F38,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthEnemy3: {
    address: 0x01D27F3C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  isDeadEnemy3: {
    address: 0x01D27FA0,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: val => val === 1,
    valueTransformerIn: null
  },
  displayNameEnemy3: {
    address: 0x01D75078,
    offsets: [],
    type: 'bytes',
    size: 14,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentStatusEnemy3: {
    address: 0x01D975D4,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentHealthEnemy4: {
    address: 0x01D28008,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthEnemy4: {
    address: 0x01D2800C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  isDeadEnemy4: {
    address: 0x01D28070,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: val => val === 1,
    valueTransformerIn: null
  },
  displayNameEnemy4: {
    address: 0x01D75098,
    offsets: [],
    type: 'bytes',
    size: 14,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentStatusEnemy4: {
    address: 0x01D97670,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  enemyAttacksEnabled: {
    address: 0x0047D795,
    offsets: [],
    type: 'bytes',
    size: 5,
    valueTransformerOut: val => _.isEqual(val, [232,22,112,0,0]), // If the bytes have been replaced with noops (144) return false, otherwise true
    valueTransformerIn: val => val ? [232,22,112,0,0] : [144,144,144,144,144]
  },
  // PartyMembers in battle (3 slots)
  teamMemberIdPartyMember1: {
    address: 0x01CFE74C,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentHealthPartyMember1: {
    address: 0x01CFF172,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthPartyMember1: {
    address: 0x01CFF174,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  teamMemberIdPartyMember2: {
    address: 0x01CFE74D,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentHealthPartyMember2: {
    address: 0x01CFF342,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthPartyMember2: {
    address: 0x01CFF344,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  teamMemberIdPartyMember3: {
    address: 0x01CFE74E,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentHealthPartyMember3: {
    address: 0x001CFF512,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthPartyMember3: {
    address: 0x01CFF514,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  // Team Members (in general, no association to a battle)
  maxHealthModifier1TeamMemberSquall: {
    address: 0x01CF75F4,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier2TeamMemberSquall: {
    address: 0x01CF75F6,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  healthBonusSpellTeamMemberSquall: {
    address: 0x01CFE144,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  displayNameTeamMemberSquall: {
    address: 0x01CFDC70,
    offsets: [],
    type: 'bytes',
    size: 7,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentHealthTeamMemberSquall: {
    address: 0x01CFE0E8,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentExpTeamMemberSquall: {
    address: 0x01CFE0EC,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentLevelTeamMemberSquall: {
    address: 0x01CFE0EC,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: val => Math.floor(val / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => (val - 1) * 1000             // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberSquall: {
    address: 0x01CFE0F8,
    offsets: [],
    type: 'bytes',
    size: 64, // 32 slots * 2 bytes per slot = 64 bytes
    valueTransformerOut: val => _.chunk(val, 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => _.flatten(val)    // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberSquall: {
    address: 0x01CFE17C,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier1TeamMemberZell: {
    address: 0x01CF7618,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier2TeamMemberZell: {
    address: 0x01CF761A,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  healthBonusSpellTeamMemberZell: {
    address: 0x01CFE1DC,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  displayNameTeamMemberZell: {
    address: 0x01CFA1AC,
    offsets: [],
    type: 'bytes',
    size: 4,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentHealthTeamMemberZell: {
    address: 0x01CFE180,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentExpTeamMemberZell: {
    address: 0x01CFE184,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentLevelTeamMemberZell: {
    address: 0x01CFE184,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: val => Math.floor(val / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => (val - 1) * 1000             // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberZell: {
    address: 0x01CFE190,
    offsets: [],
    type: 'bytes',
    size: 64, // 32 slots * 2 bytes per slot = 64 bytes
    valueTransformerOut: val => _.chunk(val, 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => _.flatten(val)    // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberZell: {
    address: 0x01CFE214,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier1TeamMemberIrvine: {
    address: 0x01CF763C,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier2TeamMemberIrvine: {
    address: 0x01CF763E,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  healthBonusSpellTeamMemberIrvine: {
    address: 0x01CFE274,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  displayNameTeamMemberIrvine: {
    address: 0x01CFA1B1,
    offsets: [],
    type: 'bytes',
    size: 6,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentHealthTeamMemberIrvine: {
    address: 0x01CFE218,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentExpTeamMemberIrvine: {
    address: 0x01CFE21C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentLevelTeamMemberIrvine: {
    address: 0x01CFE21C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: val => Math.floor(val / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => (val - 1) * 1000             // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberIrvine: {
    address: 0x01CFE228,
    offsets: [],
    type: 'bytes',
    size: 64, // 32 slots * 2 bytes per slot = 64 bytes
    valueTransformerOut: val => _.chunk(val, 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => _.flatten(val)    // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberIrvine: {
    address: 0x01CFE2AC,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier1TeamMemberQuistis: {
    address: 0x01CF7660,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier2TeamMemberQuistis: {
    address: 0x01CF7662,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  healthBonusSpellTeamMemberQuistis: {
    address: 0x01CFE30C,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  displayNameTeamMemberQuistis: {
    address: 0x01CFA1B8,
    offsets: [],
    type: 'bytes',
    size: 7,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentHealthTeamMemberQuistis: {
    address: 0x01CFE2B0,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentExpTeamMemberQuistis: {
    address: 0x01CFE2B4,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentLevelTeamMemberQuistis: {
    address: 0x01CFE2B4,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: val => Math.floor(val / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => (val - 1) * 1000             // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberQuistis: {
    address: 0x01CFE2C0,
    offsets: [],
    type: 'bytes',
    size: 64, // 32 slots * 2 bytes per slot = 64 bytes
    valueTransformerOut: val => _.chunk(val, 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => _.flatten(val)    // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberQuistis: {
    address: 0x01CFE344,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier1TeamMemberRinoa: {
    address: 0x01CF7684,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier2TeamMemberRinoa: {
    address: 0x01CF7686,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  healthBonusSpellTeamMemberRinoa: {
    address: 0x01CFE3A4,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  displayNameTeamMemberRinoa: {
    address: 0x01CFDC7C,
    offsets: [],
    type: 'bytes',
    size: 7,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentHealthTeamMemberRinoa: {
    address: 0x01CFE348,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentExpTeamMemberRinoa: {
    address: 0x01CFE34C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentLevelTeamMemberRinoa: {
    address: 0x01CFE34C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: val => Math.floor(val / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => (val - 1) * 1000             // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberRinoa: {
    address: 0x01CFE358,
    offsets: [],
    type: 'bytes',
    size: 64, // 32 slots * 2 bytes per slot = 64 bytes
    valueTransformerOut: val => _.chunk(val, 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => _.flatten(val)    // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberRinoa: {
    address: 0x01CFE3DC,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier1TeamMemberSelphie: {
    address: 0x01CF76A8,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier2TeamMemberSelphie: {
    address: 0x01CF76AA,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  healthBonusSpellTeamMemberSelphie: {
    address: 0x01CFE43C,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  displayNameTeamMemberSelphie: {
    address: 0x01CFA1C0,
    offsets: [],
    type: 'bytes',
    size: 7,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentHealthTeamMemberSelphie: {
    address: 0x01CFE3E0,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentExpTeamMemberSelphie: {
    address: 0x01CFE3E4,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentLevelTeamMemberSelphie: {
    address: 0x01CFE3E4,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: val => Math.floor(val / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => (val - 1) * 1000             // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberSelphie: {
    address: 0x01CFE3F0,
    offsets: [],
    type: 'bytes',
    size: 64, // 32 slots * 2 bytes per slot = 64 bytes
    valueTransformerOut: val => _.chunk(val, 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => _.flatten(val)    // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberSelphie: {
    address: 0x01CFE474,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier1TeamMemberSeifer: {
    address: 0x01CF76CC,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier2TeamMemberSeifer: {
    address: 0x01CF76CE,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  healthBonusSpellTeamMemberSeifer: {
    address: 0x01CFE4D4,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  displayNameTeamMemberSeifer: {
    address: 0x01CFA1C8,
    offsets: [],
    type: 'bytes',
    size: 6,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentHealthTeamMemberSeifer: {
    address: 0x01CFE478,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentExpTeamMemberSeifer: {
    address: 0x01CFE47C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentLevelTeamMemberSeifer: {
    address: 0x01CFE47C,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: val => Math.floor(val / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => (val - 1) * 1000             // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberSeifer: {
    address: 0x01CFE488,
    offsets: [],
    type: 'bytes',
    size: 64, // 32 slots * 2 bytes per slot = 64 bytes
    valueTransformerOut: val => _.chunk(val, 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => _.flatten(val)    // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberSeifer: {
    address: 0x01CFE50C,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier1TeamMemberEdea: {
    address: 0x01CF76F0,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  maxHealthModifier2TeamMemberEdea: {
    address: 0x01CF76F2,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  healthBonusSpellTeamMemberEdea: {
    address: 0x01CFE56C,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  displayNameTeamMemberEdea: {
    address: 0x01CFA1CF,
    offsets: [],
    type: 'bytes',
    size: 4,
    valueTransformerOut: val => _.map(_.dropRight(val, _.size(val) - (_.indexOf(val, 0) > -1 ? _.indexOf(val, 0) : _.size(val))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: null
  },
  currentHealthTeamMemberEdea: {
    address: 0x01CFE510,
    offsets: [],
    type: 'short',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentExpTeamMemberEdea: {
    address: 0x01CFE514,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
  currentLevelTeamMemberEdea: {
    address: 0x01CFE514,
    offsets: [],
    type: 'int',
    size: null,
    valueTransformerOut: val => Math.floor(val / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => (val - 1) * 1000             // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberEdea: {
    address: 0x01CFE520,
    offsets: [],
    type: 'bytes',
    size: 64, // 32 slots * 2 bytes per slot = 64 bytes
    valueTransformerOut: val => _.chunk(val, 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => _.flatten(val)    // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberEdea: {
    address: 0x01CFE5A4,
    offsets: [],
    type: 'byte',
    size: null,
    valueTransformerOut: null,
    valueTransformerIn: null
  },
};
