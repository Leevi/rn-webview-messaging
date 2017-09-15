import React, { Component } from 'react'
import { WebView as NativeWebView } from 'react-native'

const ProtocolJSON = 'x-json-msg:'

const middlewares = [(webView) => (message) => {
  if (webView.props.onMessage) {
    webView.props.onMessage(message)
  }
}]

export class WebView extends Component {
  _mountWebView (webView) {
    this.webView = webView
    this._onMessage = middlewares[0](this)
    for (var i = 1; i < middlewares.length; i++) {
      this._onMessage = middlewares[i](this, this._onMessage)
    }
  }

  _parseMessage (event) {
    var data = event.nativeEvent.data
    if (data.startsWith(ProtocolJSON)) {
      data = JSON.parse(data.substring(ProtocolJSON.length))
    }
    this._onMessage({data, event})
  }

  render () {
    return (
      <NativeWebView {...this.props}
        ref={this._mountWebView.bind(this)}
        onMessage={this._parseMessage.bind(this)} />
    )
  }

  postMessage (message) {
    this.webView.postMessage(ProtocolJSON + JSON.stringify(message))
  }
}

export function registerMiddleware (middleware) {
  middlewares.splice(1, 0, middleware)
}
