"use strict";

var fs = require('fs');

exports.prepareUploadFolder = function (path) {
  var pathExist = fs.existsSync(path);

  if (!pathExist) {
    fs.mkdirSync(path, {
      recursive: true
    });
  }
};

exports.diffArray = function diffArray(arr1, arr2) {
  return arr1.concat(arr2).filter(function (item) {
    return !arr1.includes(item) || !arr2.includes(item);
  });
}; // exports.CLIENT_ID ="955629593375-d9clq2bgo0lndiil58tjthsl3o3d60n8.apps.googleusercontent.com"
// exports.CLIENT_SECRET = "JsOhd6LO1HI23juwmNT08nWl"
// exports.REDIRECT_URI = "https://developers.google.com/oauthplayground"
// exports.REFRESH_TOKEN = "1//041PdX-G0eMm2CgYIARAAGAQSNwF-L9IrBOji3DBHok45ID93NFOtnnZRzJbnOuMyl5c73tkeu09OttcYyXFUBEmQzDsM80a7KqU"


exports.CLIENT_ID = "987244501943-32npfb477vnv5anufsfol6mbpeb9n5f4.apps.googleusercontent.com";
exports.CLIENT_SECRET = "z2aG1AdiLfR9XPQUNpRtwavk";
exports.REDIRECT_URI = "https://developers.google.com/oauthplayground";
exports.REFRESH_TOKEN = "1//04GrhO0Od_oecCgYIARAAGAQSNwF-L9Irf96ALvW3zqtJ5CxeR7R4Vkndc-odAJQO_WcOVP3qTkkE6nGA1nkJLhbH1D8Qq6HIr6Y";