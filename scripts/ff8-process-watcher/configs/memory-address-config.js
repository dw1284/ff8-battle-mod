const _ = require('lodash');
const characterSet = require('../configs/character-set');

const defaultValueTransformerOut = vals => vals[0];
const defaultValueTransformerIn = val => [val];

module.exports = {
  menuIsOpen: {
    locations: [{
      address:0x01D2A27C,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
  battleStarted: {
    locations: [{
      address:0x01A79D88,
      offsets: [0xB40],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => vals[0] > 1000000000, // This address points to another address, and the higher that address the more likely we are in battle
    valueTransformerIn: defaultValueTransformerIn
  },
  enemyAttacksEnabled: {
    locations: [{
      address: 0x00489FBB,
      offsets: [],
      type: 'bytes',
      size: 5,
    }],
    valueTransformerOut: vals => _.isEqual(vals[0], [232,112,72,0,0]), // If the bytes have been replaced with noops (144) return false, otherwise true
    valueTransformerIn: val => [val ? [232,112,72,0,0] : [144,144,144,144,144]]
  },
  damageLimitEnabled: {
    locations: [{
      address: 0x00491141,
      offsets: [],
      type: 'bytes',
      size: 2,
    }],
    // Here we do some code injection (via array of bytes) that removes the 9999 damage limit
    valueTransformerOut: vals => _.isEqual(vals[0], [139,241]),
    valueTransformerIn: val => [val ? [139,241] : [139,246]]
  },
  killOnNextPoisonTick: {
    locations: [{
      address: 0x00490565,
      offsets: [],
      type: 'bytes',
      size: 15,
    }],
    // Here we do some code injection (via array of bytes) that removes the poison damage calc and
    // replaces it with the target's max health effectivly killing the target on the next poison tick
    valueTransformerOut: vals => _.isEqual(vals[0], [139,209,144,144,144,144,144,144,144,144,144,144,144,144,144]),
    valueTransformerIn: val => [val ? [139,209,144,144,144,144,144,144,144,144,144,144,144,144,144] : [15,175,202,184,31,133,235,81,247,233,193,250,5,139,202]]
  },
  // Enemy 1 (in battle)
  atbEnemy1: {
    locations: [{
      address:0x01D27D95,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: null,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthEnemy1: {
    locations: [{
      address:0x01D27D98,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthEnemy1: {
    locations: [{
      address:0x01D27D9C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameEnemy1: {
    locations: [{
      address:0x01D75038,
      offsets: [],
      type: 'bytes',
      size: 14
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  isDeadEnemy1: {
    locations: [{
      address:0x01D27E00,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => vals[0] === 1,
    valueTransformerIn: defaultValueTransformerIn
  },
  hasSleepEnemy1: {
    locations: [{
      address:0x01D27D88,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 1) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 1, prevVals[1] | 4096] : [prevVals[0] & ~1, prevVals[1] & ~4096]
  },
  hasHasteEnemy1: {
    locations: [{
      address:0x01D27D88,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 2, prevVals[1] | 16384] : [prevVals[0] & ~2, prevVals[1] & ~16384]
  },
  hasSlowEnemy1: {
    locations: [{
      address:0x01D27D88,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 4) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 4, prevVals[1] | 32768] : [prevVals[0] & ~4, prevVals[1] & ~32768]
  },
  hasStopEnemy1: {
    locations: [{
      address:0x01D27D88,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 8) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 8, prevVals[1] | 8] : [prevVals[0] & ~8, prevVals[1] & ~8]
  },
  hasProtectEnemy1: {
    locations: [{
      address:0x01D27D88,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 32) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 32] : [prevVals[0] & ~32]
  },
  hasShellEnemy1: {
    locations: [{
      address:0x01D27D88,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64] : [prevVals[0] & ~64]
  },
  hasReflectEnemy1: {
    locations: [{
      address:0x01D27D88,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 128) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 128] : [prevVals[0] & ~128]
  },
  hasAuraEnemy1: {
    locations: [{
      address:0x01D27D89,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 1) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 1, prevVals[1] | 131072] : [prevVals[0] & ~1, prevVals[1] & ~131072]
  },
  hasConfuseEnemy1: {
    locations: [{
      address:0x01D27D89,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64, prevVals[1] | 2048] : [prevVals[0] & ~64, prevVals[1] & ~2048]
  },
  hasPoisonEnemy1: {
    locations: [{
      address:0x01D27E00,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 2, prevVals[1] | 32] : [prevVals[0] & ~2, prevVals[1] & ~32]
  },
  hasPoisonWithoutAnimationEnemy1: {
    locations: [{
      address:0x01D27E00,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => [val ? prevVals[0] | 2 : prevVals[0] & ~2]
  },
  hasPetrifyEnemy1: {
    locations: [{
      address:0x01D27E00,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 4) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 4, prevVals[1] | 16] : [prevVals[0] & ~4, prevVals[1] & ~16]
  },
  hasDarknessEnemy1: {
    locations: [{
      address:0x01D27E00,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 8) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 8, prevVals[1] | 64] : [prevVals[0] & ~8, prevVals[1] & ~64]
  },
  hasSilenceEnemy1: {
    locations: [{
      address:0x01D27E00,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 16) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 16, prevVals[1] | 128] : [prevVals[0] & ~16, prevVals[1] & ~128]
  },
  hasBerserkEnemy1: {
    locations: [{
      address:0x01D27E00,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 32) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 32, prevVals[1] | 256] : [prevVals[0] & ~32, prevVals[1] & ~256]
  },
  hasZombieEnemy1: {
    locations: [{
      address:0x01D27E00,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D9749C,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64, prevVals[1] | 1024] : [prevVals[0] & ~64, prevVals[1] & ~1024]
  },
  hasRegenEnemy1: {
    locations: [{
      address:0x01D27DDD,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => _.inRange(vals[0], 0, 126),
    valueTransformerIn: val => [val ? 125 : 251]
  },
  // Enemy 2 (in battle)
  atbEnemy2: {
    locations: [{
      address:0x01D27E65,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: null,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthEnemy2: {
    locations: [{
      address:0x01D27E68,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthEnemy2: {
    locations: [{
      address: 0x01D27E6C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameEnemy2: {
    locations: [{
      address: 0x01D75058,
      offsets: [],
      type: 'bytes',
      size: 14,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  isDeadEnemy2: {
    locations: [{
      address: 0x01D27ED0,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] === 1,
    valueTransformerIn: defaultValueTransformerIn
  },
  hasSleepEnemy2: {
    locations: [{
      address:0x01D27E58,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 1) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 1, prevVals[1] | 4096] : [prevVals[0] & ~1, prevVals[1] & ~4096]
  },
  hasHasteEnemy2: {
    locations: [{
      address:0x01D27E58,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 2, prevVals[1] | 16384] : [prevVals[0] & ~2, prevVals[1] & ~16384]
  },
  hasSlowEnemy2: {
    locations: [{
      address:0x01D27E58,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 4) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 4, prevVals[1] | 32768] : [prevVals[0] & ~4, prevVals[1] & ~32768]
  },
  hasStopEnemy2: {
    locations: [{
      address:0x01D27E58,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 8) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 8, prevVals[1] | 8] : [prevVals[0] & ~8, prevVals[1] & ~8]
  },
  hasProtectEnemy2: {
    locations: [{
      address:0x01D27E58,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 32) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 32] : [prevVals[0] & ~32]
  },
  hasShellEnemy2: {
    locations: [{
      address:0x01D27E58,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64] : [prevVals[0] & ~64]
  },
  hasReflectEnemy2: {
    locations: [{
      address:0x01D27E58,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 128) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 128] : [prevVals[0] & ~128]
  },
  hasAuraEnemy2: {
    locations: [{
      address:0x01D27E59,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 1) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 1, prevVals[1] | 131072] : [prevVals[0] & ~1, prevVals[1] & ~131072]
  },
  hasConfuseEnemy2: {
    locations: [{
      address:0x01D27E59,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64, prevVals[1] | 2048] : [prevVals[0] & ~64, prevVals[1] & ~2048]
  },
  hasPoisonEnemy2: {
    locations: [{
      address:0x01D27ED0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 2, prevVals[1] | 32] : [prevVals[0] & ~2, prevVals[1] & ~32]
  },
  hasPoisonWithoutAnimationEnemy2: {
    locations: [{
      address:0x01D27ED0,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => [val ? prevVals[0] | 2 : prevVals[0] & ~2]
  },
  hasPetrifyEnemy2: {
    locations: [{
      address:0x01D27ED0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 4) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 4, prevVals[1] | 16] : [prevVals[0] & ~4, prevVals[1] & ~16]
  },
  hasDarknessEnemy2: {
    locations: [{
      address:0x01D27ED0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 8) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 8, prevVals[1] | 64] : [prevVals[0] & ~8, prevVals[1] & ~64]
  },
  hasSilenceEnemy2: {
    locations: [{
      address:0x01D27ED0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 16) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 16, prevVals[1] | 128] : [prevVals[0] & ~16, prevVals[1] & ~128]
  },
  hasBerserkEnemy2: {
    locations: [{
      address:0x01D27ED0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 32) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 32, prevVals[1] | 256] : [prevVals[0] & ~32, prevVals[1] & ~256]
  },
  hasZombieEnemy2: {
    locations: [{
      address:0x01D27ED0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x1D97538,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64, prevVals[1] | 1024] : [prevVals[0] & ~64, prevVals[1] & ~1024]
  },
  hasRegenEnemy2: {
    locations: [{
      address:0x01D27EAD,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => _.inRange(vals[0], 0, 126),
    valueTransformerIn: val => [val ? 125 : 251]
  },
  // Enemy 3 (in battle)
  atbEnemy3: {
    locations: [{
      address: 0x01D27F35,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: null,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthEnemy3: {
    locations: [{
      address: 0x01D27F38,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthEnemy3: {
    locations: [{
      address: 0x01D27F3C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameEnemy3: {
    locations: [{
      address: 0x01D75078,
      offsets: [],
      type: 'bytes',
      size: 14,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  isDeadEnemy3: {
    locations: [{
      address: 0x01D27FA0,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] === 1,
    valueTransformerIn: defaultValueTransformerIn
  },
  hasSleepEnemy3: {
    locations: [{
      address:0x01D27F28,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 1) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 1, prevVals[1] | 4096] : [prevVals[0] & ~1, prevVals[1] & ~4096]
  },
  hasHasteEnemy3: {
    locations: [{
      address:0x01D27F28,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 2, prevVals[1] | 16384] : [prevVals[0] & ~2, prevVals[1] & ~16384]
  },
  hasSlowEnemy3: {
    locations: [{
      address:0x01D27F28,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 4) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 4, prevVals[1] | 32768] : [prevVals[0] & ~4, prevVals[1] & ~32768]
  },
  hasStopEnemy3: {
    locations: [{
      address:0x01D27F28,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 8) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 8, prevVals[1] | 8] : [prevVals[0] & ~8, prevVals[1] & ~8]
  },
  hasProtectEnemy3: {
    locations: [{
      address:0x01D27F28,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 32) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 32] : [prevVals[0] & ~32]
  },
  hasShellEnemy3: {
    locations: [{
      address:0x01D27F28,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64] : [prevVals[0] & ~64]
  },
  hasReflectEnemy3: {
    locations: [{
      address:0x01D27F28,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 128) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 128] : [prevVals[0] & ~128]
  },
  hasAuraEnemy3: {
    locations: [{
      address:0x01D27F29,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 1) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 1, prevVals[1] | 131072] : [prevVals[0] & ~1, prevVals[1] & ~131072]
  },
  hasConfuseEnemy3: {
    locations: [{
      address:0x01D27F29,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64, prevVals[1] | 2048] : [prevVals[0] & ~64, prevVals[1] & ~2048]
  },
  hasPoisonEnemy3: {
    locations: [{
      address:0x01D27FA0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 2, prevVals[1] | 32] : [prevVals[0] & ~2, prevVals[1] & ~32]
  },
  hasPoisonWithoutAnimationEnemy3: {
    locations: [{
      address:0x01D27FA0,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => [val ? prevVals[0] | 2 : prevVals[0] & ~2]
  },
  hasPetrifyEnemy3: {
    locations: [{
      address:0x01D27FA0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 4) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 4, prevVals[1] | 16] : [prevVals[0] & ~4, prevVals[1] & ~16]
  },
  hasDarknessEnemy3: {
    locations: [{
      address:0x01D27FA0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 8) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 8, prevVals[1] | 64] : [prevVals[0] & ~8, prevVals[1] & ~64]
  },
  hasSilenceEnemy3: {
    locations: [{
      address:0x01D27FA0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 16) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 16, prevVals[1] | 128] : [prevVals[0] & ~16, prevVals[1] & ~128]
  },
  hasBerserkEnemy3: {
    locations: [{
      address:0x01D27FA0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 32) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 32, prevVals[1] | 256] : [prevVals[0] & ~32, prevVals[1] & ~256]
  },
  hasZombieEnemy3: {
    locations: [{
      address:0x01D27FA0,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D975D4,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64, prevVals[1] | 1024] : [prevVals[0] & ~64, prevVals[1] & ~1024]
  },
  hasRegenEnemy3: {
    locations: [{
      address:0x01D27F7D,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => _.inRange(vals[0], 0, 126),
    valueTransformerIn: val => [val ? 125 : 251]
  },
  // Enemy 4 (in battle)
  atbEnemy4: {
    locations: [{
      address: 0x01D28005,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: null,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthEnemy4: {
    locations: [{
      address: 0x01D28008,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthEnemy4: {
    locations: [{
      address: 0x01D2800C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameEnemy4: {
    locations: [{
      address: 0x01D75098,
      offsets: [],
      type: 'bytes',
      size: 14,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  isDeadEnemy4: {
    locations: [{
      address: 0x01D28070,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] === 1,
    valueTransformerIn: defaultValueTransformerIn
  },
  hasSleepEnemy4: {
    locations: [{
      address:0x01D28012,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 1) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 1, prevVals[1] | 4096] : [prevVals[0] & ~1, prevVals[1] & ~4096]
  },
  hasHasteEnemy4: {
    locations: [{
      address:0x01D28012,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 2, prevVals[1] | 16384] : [prevVals[0] & ~2, prevVals[1] & ~16384]
  },
  hasSlowEnemy4: {
    locations: [{
      address:0x01D28012,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 4) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 4, prevVals[1] | 32768] : [prevVals[0] & ~4, prevVals[1] & ~32768]
  },
  hasStopEnemy4: {
    locations: [{
      address:0x01D28012,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 8) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 8, prevVals[1] | 8] : [prevVals[0] & ~8, prevVals[1] & ~8]
  },
  hasProtectEnemy4: {
    locations: [{
      address:0x01D28012,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 32) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 32] : [prevVals[0] & ~32]
  },
  hasShellEnemy4: {
    locations: [{
      address:0x01D28012,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64] : [prevVals[0] & ~64]
  },
  hasReflectEnemy4: {
    locations: [{
      address:0x01D28012,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 128) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 128] : [prevVals[0] & ~128]
  },
  hasAuraEnemy4: {
    locations: [{
      address:0x01D28013,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 1) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 1, prevVals[1] | 131072] : [prevVals[0] & ~1, prevVals[1] & ~131072]
  },
  hasConfuseEnemy4: {
    locations: [{
      address:0x01D28013,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64, prevVals[1] | 2048] : [prevVals[0] & ~64, prevVals[1] & ~2048]
  },
  hasPoisonEnemy4: {
    locations: [{
      address:0x01D28070,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 2, prevVals[1] | 32] : [prevVals[0] & ~2, prevVals[1] & ~32]
  },
  hasPoisonWithoutAnimationEnemy4: {
    locations: [{
      address:0x01D28070,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 2) > 0,
    valueTransformerIn: (val, prevVals) => [val ? prevVals[0] | 2 : prevVals[0] & ~2]
  },
  hasPetrifyEnemy4: {
    locations: [{
      address:0x01D28070,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 4) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 4, prevVals[1] | 16] : [prevVals[0] & ~4, prevVals[1] & ~16]
  },
  hasDarknessEnemy4: {
    locations: [{
      address:0x01D28070,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 8) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 8, prevVals[1] | 64] : [prevVals[0] & ~8, prevVals[1] & ~64]
  },
  hasSilenceEnemy4: {
    locations: [{
      address:0x01D28070,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 16) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 16, prevVals[1] | 128] : [prevVals[0] & ~16, prevVals[1] & ~128]
  },
  hasBerserkEnemy4: {
    locations: [{
      address:0x01D28070,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 32) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 32, prevVals[1] | 256] : [prevVals[0] & ~32, prevVals[1] & ~256]
  },
  hasZombieEnemy4: {
    locations: [{
      address:0x01D28070,
      offsets: [],
      type: 'byte',
      size: null
    }, {
      address:0x01D97670,
      offsets: [],
      type: 'int',
      size: null
    }],
    valueTransformerOut: vals => (vals[0] & 64) > 0,
    valueTransformerIn: (val, prevVals) => val ? [prevVals[0] | 64, prevVals[1] | 1024] : [prevVals[0] & ~64, prevVals[1] & ~1024]
  },
  hasRegenEnemy4: {
    locations: [{
      address:0x01D2804D,
      offsets: [],
      type: 'byte',
      size: null
    }],
    valueTransformerOut: vals => _.inRange(vals[0], 0, 126),
    valueTransformerIn: val => [val ? 125 : 251]
  },
  // Party 1 (in battle)
  teamMemberIdPartyMember1: {
    locations: [{
      address: 0x01CFE74C,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthPartyMember1: {
    locations: [{
      address: 0x01CFF172,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthPartyMember1: {
    locations: [{
      address: 0x01CFF174,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  // Party 2 (in battle)
  teamMemberIdPartyMember2: {
    locations: [{
      address: 0x01CFE74D,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthPartyMember2: {
    locations: [{
      address: 0x01CFF342,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthPartyMember2: {
    locations: [{
      address: 0x01CFF344,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  // Party 3 (in battle)
  teamMemberIdPartyMember3: {
    locations: [{
      address: 0x01CFE74E,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthPartyMember3: {
    locations: [{
      address: 0x001CFF512,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthPartyMember3: {
    locations: [{
      address: 0x01CFF514,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  // Team Members (in general, no association to a battle)
  // Squall
  maxHealthModifier1TeamMemberSquall: {
    locations: [{
      address: 0x01CF75F4,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthModifier2TeamMemberSquall: {
    locations: [{
      address: 0x01CF75F6,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  healthBonusSpellTeamMemberSquall: {
    locations: [{
      address: 0x01CFE144,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameTeamMemberSquall: {
    locations: [{
      address: 0x01CFDC70,
      offsets: [],
      type: 'bytes',
      size: 7,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthTeamMemberSquall: {
    locations: [{
      address: 0x01CFE0E8,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentExpTeamMemberSquall: {
    locations: [{
      address: 0x01CFE0EC,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentLevelTeamMemberSquall: {
    locations: [{
      address: 0x01CFE0EC,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: vals => Math.floor(vals[0] / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => [(val - 1) * 1000]                // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberSquall: {
    locations: [{
      address: 0x01CFE0F8,
      offsets: [],
      type: 'bytes',
      size: 64 // 32 slots * 2 bytes per slot = 64 bytes
    }],
    valueTransformerOut: vals => _.chunk(vals[0], 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => [_.flatten(val)]       // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberSquall: {
    locations: [{
      address: 0x01CFE17C,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
  // Zell
  maxHealthModifier1TeamMemberZell: {
    locations: [{
      address: 0x01CF7618,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthModifier2TeamMemberZell: {
    locations: [{
      address: 0x01CF761A,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  healthBonusSpellTeamMemberZell: {
    locations: [{
      address: 0x01CFE1DC,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameTeamMemberZell: {
    locations: [{
      address: 0x01CFA1AC,
      offsets: [],
      type: 'bytes',
      size: 4,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthTeamMemberZell: {
    locations: [{
      address: 0x01CFE180,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentExpTeamMemberZell: {
    locations: [{
      address: 0x01CFE184,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentLevelTeamMemberZell: {
    locations: [{
      address: 0x01CFE184,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: vals => Math.floor(vals[0] / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => [(val - 1) * 1000]                // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberZell: {
    locations: [{
      address: 0x01CFE190,
      offsets: [],
      type: 'bytes',
      size: 64 // 32 slots * 2 bytes per slot = 64 bytes
    }],
    valueTransformerOut: vals => _.chunk(vals[0], 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => [_.flatten(val)]       // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberZell: {
    locations: [{
      address: 0x01CFE214,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
  // Irvine
  maxHealthModifier1TeamMemberIrvine: {
    locations: [{
      address: 0x01CF763C,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthModifier2TeamMemberIrvine: {
    locations: [{
      address: 0x01CF763E,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  healthBonusSpellTeamMemberIrvine: {
    locations: [{
      address: 0x01CFE274,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameTeamMemberIrvine: {
    locations: [{
      address: 0x01CFA1B1,
      offsets: [],
      type: 'bytes',
      size: 6,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthTeamMemberIrvine: {
    locations: [{
      address: 0x01CFE218,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentExpTeamMemberIrvine: {
    locations: [{
      address: 0x01CFE21C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentLevelTeamMemberIrvine: {
    locations: [{
      address: 0x01CFE21C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: vals => Math.floor(vals[0] / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => [(val - 1) * 1000]                // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberIrvine: {
    locations: [{
      address: 0x01CFE228,
      offsets: [],
      type: 'bytes',
      size: 64 // 32 slots * 2 bytes per slot = 64 bytes
    }],
    valueTransformerOut: vals => _.chunk(vals[0], 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => [_.flatten(val)]       // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberIrvine: {
    locations: [{
      address: 0x01CFE2AC,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
  // Quistis
  maxHealthModifier1TeamMemberQuistis: {
    locations: [{
      address: 0x01CF7660,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthModifier2TeamMemberQuistis: {
    locations: [{
      address: 0x01CF7662,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  healthBonusSpellTeamMemberQuistis: {
    locations: [{
      address: 0x01CFE30C,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameTeamMemberQuistis: {
    locations: [{
      address: 0x01CFA1B8,
      offsets: [],
      type: 'bytes',
      size: 7,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthTeamMemberQuistis: {
    locations: [{
      address: 0x01CFE2B0,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentExpTeamMemberQuistis: {
    locations: [{
      address: 0x01CFE2B4,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentLevelTeamMemberQuistis: {
    locations: [{
      address: 0x01CFE2B4,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: vals => Math.floor(vals[0] / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => [(val - 1) * 1000]                // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberQuistis: {
    locations: [{
      address: 0x01CFE2C0,
      offsets: [],
      type: 'bytes',
      size: 64 // 32 slots * 2 bytes per slot = 64 bytes
    }],
    valueTransformerOut: vals => _.chunk(vals[0], 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => [_.flatten(val)]       // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberQuistis: {
    locations: [{
      address: 0x01CFE344,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
  // Rinoa
  maxHealthModifier1TeamMemberRinoa: {
    locations: [{
      address: 0x01CF7684,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthModifier2TeamMemberRinoa: {
    locations: [{
      address: 0x01CF7686,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  healthBonusSpellTeamMemberRinoa: {
    locations: [{
      address: 0x01CFE3A4,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameTeamMemberRinoa: {
    locations: [{
      address: 0x01CFDC7C,
      offsets: [],
      type: 'bytes',
      size: 7,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthTeamMemberRinoa: {
    locations: [{
      address: 0x01CFE348,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentExpTeamMemberRinoa: {
    locations: [{
      address: 0x01CFE34C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentLevelTeamMemberRinoa: {
    locations: [{
      address: 0x01CFE34C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: vals => Math.floor(vals[0] / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => [(val - 1) * 1000]                // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberRinoa: {
    locations: [{
      address: 0x01CFE358,
      offsets: [],
      type: 'bytes',
      size: 64 // 32 slots * 2 bytes per slot = 64 bytes
    }],
    valueTransformerOut: vals => _.chunk(vals[0], 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => [_.flatten(val)]       // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberRinoa: {
    locations: [{
      address: 0x01CFE3DC,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
  // Selphie
  maxHealthModifier1TeamMemberSelphie: {
    locations: [{
      address: 0x01CF76A8,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthModifier2TeamMemberSelphie: {
    locations: [{
      address: 0x01CF76AA,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  healthBonusSpellTeamMemberSelphie: {
    locations: [{
      address: 0x01CFE43C,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameTeamMemberSelphie: {
    locations: [{
      address: 0x01CFA1C0,
      offsets: [],
      type: 'bytes',
      size: 7,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthTeamMemberSelphie: {
    locations: [{
      address: 0x01CFE3E0,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentExpTeamMemberSelphie: {
    locations: [{
      address: 0x01CFE3E4,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentLevelTeamMemberSelphie: {
    locations: [{
      address: 0x01CFE3E4,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: vals => Math.floor(vals[0] / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => [(val - 1) * 1000]                // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberSelphie: {
    locations: [{
      address: 0x01CFE3F0,
      offsets: [],
      type: 'bytes',
      size: 64 // 32 slots * 2 bytes per slot = 64 bytes
    }],
    valueTransformerOut: vals => _.chunk(vals[0], 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => [_.flatten(val)]       // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberSelphie: {
    locations: [{
      address: 0x01CFE474,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
  // Seifer
  maxHealthModifier1TeamMemberSeifer: {
    locations: [{
      address: 0x01CF76CC,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthModifier2TeamMemberSeifer: {
    locations: [{
      address: 0x01CF76CE,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  healthBonusSpellTeamMemberSeifer: {
    locations: [{
      address: 0x01CFE4D4,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameTeamMemberSeifer: {
    locations: [{
      address: 0x01CFA1C8,
      offsets: [],
      type: 'bytes',
      size: 6,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthTeamMemberSeifer: {
    locations: [{
      address: 0x01CFE478,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentExpTeamMemberSeifer: {
    locations: [{
      address: 0x01CFE47C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentLevelTeamMemberSeifer: {
    locations: [{
      address: 0x01CFE47C,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: vals => Math.floor(vals[0] / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => [(val - 1) * 1000]                // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberSeifer: {
    locations: [{
      address: 0x01CFE488,
      offsets: [],
      type: 'bytes',
      size: 64 // 32 slots * 2 bytes per slot = 64 bytes
    }],
    valueTransformerOut: vals => _.chunk(vals[0], 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => [_.flatten(val)]       // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberSeifer: {
    locations: [{
      address: 0x01CFE50C,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
  // Edea
  maxHealthModifier1TeamMemberEdea: {
    locations: [{
      address: 0x01CF76F0,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  maxHealthModifier2TeamMemberEdea: {
    locations: [{
      address: 0x01CF76F2,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  healthBonusSpellTeamMemberEdea: {
    locations: [{
      address: 0x01CFE56C,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  displayNameTeamMemberEdea: {
    locations: [{
      address: 0x01CFA1CF,
      offsets: [],
      type: 'bytes',
      size: 4,
    }],
    valueTransformerOut: vals => _.map(_.dropRight(vals[0], _.size(vals[0]) - (_.indexOf(vals[0], 0) > -1 ? _.indexOf(vals[0], 0) : _.size(vals[0]))), charCode => _.get(characterSet, charCode)).join(''),
    valueTransformerIn: defaultValueTransformerIn
  },
  currentHealthTeamMemberEdea: {
    locations: [{
      address: 0x01CFE510,
      offsets: [],
      type: 'short',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentExpTeamMemberEdea: {
    locations: [{
      address: 0x01CFE514,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: defaultValueTransformerOut,
    valueTransformerIn: defaultValueTransformerIn
  },
  currentLevelTeamMemberEdea: {
    locations: [{
      address: 0x01CFE514,
      offsets: [],
      type: 'int',
      size: null,
    }],
    valueTransformerOut: vals => Math.floor(vals[0] / 1000) + 1, // Divide experience by 1000 and then add 1 to get current level
    valueTransformerIn: val => [(val - 1) * 1000]                // Subtract 1 and multiply the target level by 1000 to set desired experience
  },
  magicTeamMemberEdea: {
    locations: [{
      address: 0x01CFE520,
      offsets: [],
      type: 'bytes',
      size: 64 // 32 slots * 2 bytes per slot = 64 bytes
    }],
    valueTransformerOut: vals => _.chunk(vals[0], 2), // Each magic slot is represented by 2 bytes (one telling it which spell, and the other how many owned)
    valueTransformerIn: val => [_.flatten(val)]       // Therefore we chunk this into 2 bytes and then unchunk it on the way back in (easier to work with this way)
  },
  isAvailableTeamMemberEdea: {
    locations: [{
      address: 0x01CFE5A4,
      offsets: [],
      type: 'byte',
      size: null,
    }],
    valueTransformerOut: vals => vals[0] > 0,
    valueTransformerIn: val => [val ? 1 : 0]
  },
};
