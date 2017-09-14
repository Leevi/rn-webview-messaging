'use strict';
(function (window, document) {
  var ProtocolJSON = 'x-json-msg:'
  var handlers = []
  var listeners = []
  window.addJsonMessageListener = function (handler, options) {
    if (handler.indexOf(handler) >= 0) {
      return
    }
    var listener = function (event) {
      if (event.data.startsWith(ProtocolJSON)) {
        event = Object.create(event)
        event.rawData = event.data
        event.data = JSON.parse(event.data.substring(ProtocolJSON.length))
        return handler(event)
      }
    }
    handlers.push(handler)
    listeners.push(listener)
    document.addEventListener('message', listener, options)
  }
  window.removeJsonMessageListener = function (handler) {
    var index = handlers.indexOf(handler)
    if (index >= 0) {
      handlers.splice(index, 1)
      listeners.splice(index, 1)
    }
  }
  window.postJsonMessage = function (message) {
    window.postMessage(ProtocolJSON + JSON.stringigy(message))
  }
})(window, document)
