'use strict'

import React, { Component } from 'react'
import { WebView as NativeWebView } from 'react-native'

const ProtocolJSON = 'x-json-msg:'

export class WebView extends Component {
  _mountWebView (webView) {
    this.webView = webView
  }

  _parseMessage ({data}) {
    if (this.props.onMessage) {
      if (data.startsWith(ProtocolJSON)) {
        data = JSON.parse(data.substring(ProtocolJSON.length))
      }
      this.props.onMessage({data})
    }
  }

  render () {
    return (
      <NativeWebView {...this.props}
        ref={this._mountWebView}
        onMessage={this._parseMessage} />
    )
  }

  postMessage (message) {
    this.webView.postMessage(ProtocolJSON + JSON.stringigy(message))
  }
}
