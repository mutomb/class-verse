import _ from 'lodash';

class Emitter {
  constructor() {
    this.events = {};/**temporary store for event-listener(s) key-value pairs*/
  }
   /** store event listener*/
   on(event, fn) {
    if (this.events[event]) this.events[event].push(fn);
    else this.events[event] = [fn];
    return this;
  }
 /** remove an event listener*/
  off(event, fn) {
    if (event && _.isFunction(fn)) {
      const listeners = this.events[event];
      const index = listeners.findIndex((_fn) => _fn === fn);
      listeners.splice(index, 1);
    } else this.events[event] = [];
    return this;
  }
 /** call all listeners associated with event*/
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => listener(...args));
    }
    return this;
  }
}

export default Emitter;
