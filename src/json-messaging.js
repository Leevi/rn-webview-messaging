'use strict';
(function () {
  var ProtocolJSON = 'x-json-msg:'
  var handlers = []
  var listeners = []
  window.addJsonMessageListener = function (handler, options) {
    if (handlers.indexOf(handler) < 0) {
      var listener = function (event) {
        if (event.data.indexOf(ProtocolJSON) === 0) {
          handler({
            data: JSON.parse(event.data.substring(ProtocolJSON.length))
          })
        }
      }
      handlers.push(handler)
      listeners.push(listener)
      document.addEventListener('message', listener, options)
    }
  }
  window.removeJsonMessageListener = function (handler) {
    var index = handlers.indexOf(handler)
    if (index >= 0) {
      handlers.splice(index, 1)
      listeners.splice(index, 1)
    }
  }
  window.postJsonMessage = function (message) {
    window.postMessage(ProtocolJSON + JSON.stringify(message))
  }
})()
