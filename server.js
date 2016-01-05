/* Create a product monitor server with local content configuration */
var express = require('express');
var monitor = require('./lib/product-monitor');

var app = monitor({
  "serverPort": 8080,
  "modulePath": "monitoring",
  "userContentPath": "user-content",
  "apiCache": {
    "debug": false,
    "enabled": true,
    "defaultDuration": 300000 // in ms, 300 seconds, 5 minutes
  },
  "productInformation": {
    "title": "Dev Monitor"
  },
  "npmUpdate": {
    "disableUpdates": false
  }
});
