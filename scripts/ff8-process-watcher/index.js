const memoryjs = require('memoryjs');
const processConfig = require('./configs/process-config');
const memoryAddressConfig = require('./configs/memory-address-config');
const events = require('events');
const _ = require('lodash');

const configsGroupedByAddress = _.reduce(memoryAddressConfig, (accumulator, addressConfig, propName) => {
  const trimmedConfig = _.pick(addressConfig, ['address', 'offsets', 'type', 'size']);
  const existingConfig = _.find(accumulator, trimmedConfig);
  const newProp = {propName, valueTransformerOut: addressConfig.valueTransformerOut, valueTransformerIn: addressConfig.valueTransformerIn};
  existingConfig ? existingConfig.props.push(newProp) : accumulator.push(_.set(trimmedConfig, 'props', [newProp]));
  return accumulator;
}, []);

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
    const {address, type, valueTransformerIn} = _.get(memoryAddressConfig, propertyName);
    val = valueTransformerIn ? valueTransformerIn(val) : val;
    type === 'bytes'
      ? writeBuffer(this.mainProcess.handle, address, val)
      : memoryjs.writeMemory(this.mainProcess.handle, address, val, type);
  });
  
  return this;
};

const watcher = createWatcher();
let gameInterval = null;

// Keep a lookout for the emulator process
function watchForProcess() {
  const processes = memoryjs.getProcesses();
  if (!watcher.mainProcess) {
    for (let emulator of processConfig) {
      watcher.mainProcess = openProcess(emulator.processName, processes);
      console.log(watcher.mainProcess);
      watcher.emulator = emulator;
      if (watcher.mainProcess) {
        watcher.stopWatching();
        gameInterval = setInterval(getUpdatedValuesFromProcess, 150);
        break;
      }
    };
  }
};

function openProcess(processName, processes) {
  if (_.find(processes, {szExeFile: processName})) {
    return memoryjs.openProcess(processName);
  } else {
    return null;
  }
};

function getUpdatedValuesFromProcess() {
  try {
    const deltasObj = _.reduce(configsGroupedByAddress, (accumulator, addressConfig) => {
      const {address, offsets, type, size, props} = addressConfig;
      const targetAddress = !_.isEmpty(offsets) ? resolvePointerAddress(address, offsets) : address;
      
      const currValFromProcess = 
        type === 'bytes'
          ? readBuffer(watcher.mainProcess.handle, targetAddress, size)
          : memoryjs.readMemory(watcher.mainProcess.handle, targetAddress, type);
      
      _.each(props, ({propName, valueTransformerOut}) => {
        const prevVal = _.cloneDeep(watcher.gameValues[propName]);
        const newVal = _.cloneDeep(currValFromProcess);
        
        if (!_.isEqual(prevVal, newVal)) {
          watcher.gameValues[propName] = newVal;
          _.set(accumulator, propName, {
            prevVal: valueTransformerOut ? valueTransformerOut(prevVal) : prevVal,
            newVal: valueTransformerOut ? valueTransformerOut(newVal) : newVal
          });
        }
      });
      
      return accumulator;
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
