"use strict";

var functions = require("firebase-functions");

var admin = require('firebase-admin');

var _require = require('./node_app/src/server'),
    FirebaseApp = _require.FirebaseApp,
    generateReportShopify = _require.generateReportShopify;

admin.initializeApp();
exports.api = functions.https.onRequest(FirebaseApp);
exports.report_scheduler = functions.pubsub.topic('update-sharafa-report').onPublish(function (data) {
  console.log('You will see this message at 10.pm from mon - sat', new Date());
  generateReportShopify();
  return null;
});