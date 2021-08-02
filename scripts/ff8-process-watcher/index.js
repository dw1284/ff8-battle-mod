const memoryjs = require('memoryjs');
const memoryAddressConfig = require('./configs/memory-address-config');
const events = require('events');
const _ = require('lodash');
const {deepScrape} = require('../utilities');

const allLocations = _.uniq(_.flatten(deepScrape(memoryAddressConfig, 'locations')));

// Public API
const createWatcher = () => {
  this.mainProcess = null;
  this.emulator = null;
  this.events = new events.EventEmitter();
  this.gameValues = {};
  this.filename = null;
  this.interval = null;
  
  this.startWatching = () => {
    this.interval = setInterval(watchForProcess, 1500);
  };
  
  this.stopWatching = () => {
    clearInterval(this.interval);
  };
  
  this.reset = () => {
    this.stopWatching();
    this.startWatching();
  };
  
  this.events.on('updateGameValue', (propertyName, val) => {
    const {locations, valueTransformerIn} = _.get(memoryAddressConfig, propertyName);
    
    const prevVals = _.map(locations, ({address, offsets, type, size}) => {
      const targetAddress = !_.isEmpty(offsets) ? resolvePointerAddress(address, offsets) : address;
      return type === 'bytes'
        ? readBuffer(watcher.mainProcess.handle, targetAddress, size)
        : memoryjs.readMemory(watcher.mainProcess.handle, targetAddress, type);
    });
    
    const newVals = valueTransformerIn ? valueTransformerIn(val, prevVals) : val;
    
    _.each(_.castArray(locations), ({address, type}, index) => {
      const valToWrite = newVals[index];
      type === 'bytes'
        ? writeBuffer(this.mainProcess.handle, address, valToWrite)
        : memoryjs.writeMemory(this.mainProcess.handle, address, valToWrite, type);
    });
  });
  
  return this;
};

const watcher = createWatcher();
let gameInterval = null;

// Keep a lookout for the process
function watchForProcess() {
  if (!watcher.mainProcess) {
    watcher.mainProcess = openProcess('FF8_EN.exe');
    if (watcher.mainProcess) {
      console.log(watcher.mainProcess);
      watcher.stopWatching();
      gameInterval = setInterval(getUpdatedValuesFromProcess, 150);
    }
  }
};

function openProcess(processName) {
  const processes = memoryjs.getProcesses();
  if (_.find(processes, {szExeFile: processName})) {
    return memoryjs.openProcess(processName);
  } else {
    return null;
  }
};

function getUpdatedValuesFromProcess() {
  try {
    const locationValues = _.map(allLocations, ({address, offsets, type, size}) => {
      const targetAddress = !_.isEmpty(offsets) ? resolvePointerAddress(address, offsets) : address;
      return type === 'bytes'
        ? readBuffer(watcher.mainProcess.handle, targetAddress, size)
        : memoryjs.readMemory(watcher.mainProcess.handle, targetAddress, type);
    });
    
    const deltasObj = _.reduce(memoryAddressConfig, (deltasObjResult, {locations, valueTransformerOut}, propName) => {
      const prevVals = _.cloneDeep(watcher.gameValues[propName]) || [];
      const newVals = _.map(locations, location => _.cloneDeep(locationValues[_.findIndex(allLocations, location)]));
        
      if (!_.isEqual(prevVals, newVals) && valueTransformerOut) {
        watcher.gameValues[propName] = newVals;
        _.set(deltasObjResult, propName, {
          prevVal: valueTransformerOut(prevVals),
          newVal: valueTransformerOut(newVals)
        });
      }
      
      return deltasObjResult;
    }, {});
    
    if (!_.isEmpty(deltasObj)) {
      watcher.events.emit(`gameValuesUpdated`, deltasObj);
    }
  } catch (err) {
    // if (err.message === '"value" argument must not be a number') {
      clearInterval(gameInterval);
      watcher.mainProcess = null;
      watcher.events.emit('processClosed');
      watcher.reset();
    // } else {
    //   errLogger.logError(err.message || JSON.stringify('err'));
    // }
  };
};

function resolvePointerAddress(pointerAddress, offsets = []) {
  let initialAddress = memoryjs.readMemory(watcher.mainProcess.handle, pointerAddress, 'int');
  
  return offsets.reduce((result, offset, index) => {
    if (index === offsets.length - 1) {
      return result + offset;
    } else {
      return memoryjs.readMemory(watcher.mainProcess.handle, result + offset, 'int');
    }
  }, initialAddress);
};

function readBuffer(handle, address, size) {
  const result = [];
  
  for (x = 0; x < size; x++) {
    result.push(memoryjs.readMemory(handle, address + x, 'byte'));
  }
  
  return result;
};

function writeBuffer(handle, address, bytes) {
  _.each(bytes, (byte, index) => memoryjs.writeMemory(handle, address + index, byte, 'byte'));
};

module.exports = watcher;
