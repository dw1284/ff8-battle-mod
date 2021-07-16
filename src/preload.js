const {contextBridge} = require('electron');
const ff8ProcessWatcher = require('../scripts/ff8-process-watcher');

contextBridge.exposeInMainWorld('onFf8ProcessWatcherEventEmit', (eventName, callback) => {
  ff8ProcessWatcher.events.on(eventName, (...args) => {    
    callback(...args);
  });
});

contextBridge.exposeInMainWorld('ff8ProcessWatcherEventEmit', (eventName, ...args) => {
  ff8ProcessWatcher.events.emit(eventName, ...args);
});

ff8ProcessWatcher.startWatching();
