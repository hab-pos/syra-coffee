"use strict";

var _require = require('./index'),
    app = _require.app; //Install express server


var express = require('express');

var cors = require('cors');

var fs = require('fs');

var _require2 = require('../Utils/constants'),
    constants = _require2.constants;

var os = require('os');

var moment = require('moment');

var path = require('path');

var _require3 = require('googleapis'),
    google = _require3.google;

var CronJob = require('cron').CronJob; // const { OrderReportRepository } = require("./reports-repository")


var _require4 = require("./OrdersApp/reports-repository"),
    OrderReportRepository = _require4.OrderReportRepository;

var CLIENT_ID = "987244501943-32npfb477vnv5anufsfol6mbpeb9n5f4.apps.googleusercontent.com";
var CLIENT_SECRET = "z2aG1AdiLfR9XPQUNpRtwavk";
var REDIRECT_URI = "https://developers.google.com/oauthplayground";
var REFRESH_TOKEN = "1//04GrhO0Od_oecCgYIARAAGAQSNwF-L9Irf96ALvW3zqtJ5CxeR7R4Vkndc-odAJQO_WcOVP3qTkkE6nGA1nkJLhbH1D8Qq6HIr6Y";
var oAuthClient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuthClient.setCredentials({
  refresh_token: REFRESH_TOKEN
});
var sheet = google.sheets({
  version: "v4",
  auth: oAuthClient
});

function getDashBoard() {
  var billingInfo_current, billing_info_current_json;
  return regeneratorRuntime.async(function getDashBoard$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(OrderReportRepository.getTotalBillings(null, null));

        case 2:
          billingInfo_current = _context.sent;
          billing_info_current_json = JSON.parse(JSON.stringify(billingInfo_current[0]));
          billing_info_current_json.avgTkt = Number(billing_info_current_json.total_amount) / Number(billing_info_current_json.count);
          return _context.abrupt("return", billing_info_current_json);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

exports.generateReportShopify = function getSheets() {
  var data;
  return regeneratorRuntime.async(function getSheets$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getDashBoard());

        case 2:
          data = _context2.sent;
          sheet.spreadsheets.values.append({
            spreadsheetId: '1D1ing_OqL0sCNPK2rXL-OheX-bGImPAnHmivfhxuhlU',
            range: 'sharafa',
            valueInputOption: 'USER_ENTERED',
            resource: {
              values: [[moment().format('DD/MM/YYYY'), data.total_amount ? "€ " + data.total_amount : "€ 0.00", data.count || 0, data.avgTkt ? "€ " + data.avgTkt : "€ 0.00"]]
            }
          }, function (err, response) {
            if (err) {
              console.log(err);
            } else {
              console.log(response);
            }
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

app.use(express["static"]('./dist'));
app.use(cors());
app.post('/paycomet', function (req, res) {
  var request = require("request");

  var reqObject = {
    "terminal": 37218,
    "jetToken": req.body.paytpvToken
  };
  var options = {
    url: "https://rest.paycomet.com/v1/cards",
    json: true,
    method: 'POST',
    body: reqObject,
    headers: {
      'Content-Type': 'application/json',
      'PAYCOMET-API-TOKEN': '0e83be0eb768b480ba47e12633bf4ea74058566d'
    }
  };
  request(options, function (err, response) {
    if (err) {
      console.log(err);
      return res.redirect('/api/url-ko');
    }

    console.log(response);
    return res.redirect('/api/user-created?user=' + response.body.idUser + "&token=" + response.body.tokenUser + "&user_name=" + req.body.username);
  }); // const request = require('request-promise');
  // let reqObject = {
  // "terminal": 37218,
  // "jetToken" : req.body.paytpvToken
  // }
  // const options = {
  //     method: 'POST',
  //     uri: 'https://rest.paycomet.com/v1/cards',
  //     body: reqObject,
  //     json: true,
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'PAYCOMET-API-TOKEN': '0e83be0eb768b480ba47e12633bf4ea74058566d'
  //     }
  // }
  // request(options).then(function (response){
  //     console.log(response)
  //     res.redirect('/user-created?user='+response.idUser+"&token="+response.tokenUser+"&user_name="+req.body.username);
  // })
  // .catch(function (err) {
  //     console.log(err);
  // })
});
app.get('/*', function (req, res) {
  var urlArray = req.url.split("/");
  console.log(req.query);

  if (urlArray[1] == "assets" && urlArray[2] == 'logos' || urlArray[1] == "assets" && urlArray[2] == 'icons') {
    var pathImage = urlArray[3];
    var extension = pathImage.split('.').pop();
    var contentType = 'image/' + extension;
    var file = '.' + req.url;
    fileToLoad = fs.readFileSync(file);
    res.writeHead(200, {
      'Content-Type': contentType
    });
    return res.end(fileToLoad, 'binary');
  } else if (urlArray[1] == "assets" && urlArray[2] == 'reciepts') {
    var _pathImage = urlArray[3];

    var _extension = _pathImage.split('.').pop();

    var _contentType = 'application/' + _extension;

    var _file = os.tmpdir() + "/" + _pathImage;

    fileToLoad = fs.readFileSync(_file);
    res.writeHead(200, {
      'Content-Type': _contentType
    });
    return res.end(fileToLoad, 'binary');
  } else if (urlArray[1] == "assets" && urlArray[2] == 'reports') {
    var _pathImage2 = urlArray[3];

    var _extension2 = _pathImage2.split('.').pop();

    var _contentType2 = 'application/' + _extension2;

    var _file2 = os.tmpdir() + '/report.pdf';

    fileToLoad = fs.readFileSync(_file2);
    res.writeHead(200, {
      'Content-Type': _contentType2
    });
    return res.end(fileToLoad, 'binary');
  } else if (urlArray[1] == "assets" && urlArray[2] == 'fonts') {
    var _pathImage3 = urlArray[3];

    var _extension3 = _pathImage3.split('.').pop();

    var _contentType3 = 'font/' + _extension3;

    var _file3 = '.' + req.url;

    fileToLoad = fs.readFileSync(_file3);
    res.writeHead(200, {
      'Content-Type': _contentType3
    });
    return res.end(fileToLoad, 'binary');
  } else if (urlArray[1] && urlArray[1].includes('get_token')) {
    res.json({
      "access_token": "eyJraWQiOiIxNDQ0NzI3MTY0Njk4IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJpWmV0dGxlIiwiYXVkIjoiQVBJIiwiZXhwIjoxNDQ0ODI1MzI1LCJqdGkiOiJXeE1vXzFaNFJQMWQ5Mi10N2owUXBRIiwiaWF0IjoxNDQ0ODIzNTI1LCJuYmYiOjE0NDQ4MjM0MDUsInN1YiI6IlllemNseEJlVHBLUDBqNXRBdmdqWXciLCJzY29wZSI6ImFsbCJ9.O-mh4Wyt-ReS-5tH2YBN2CVh1-UnyMf2xoF6Qie3pa2YGZY_u2UTU2bp0KiGjmHHLgYI5c9N1F6s7Ze-KpAyH1WZHSW8mezt25qBLpvCgr4OFkRGY7QYVa-UhVXkQ0B_shviiwubenTNCGdQl9fJlJmElqb5SQl2Tl7sraKV4T1cp5dpPZmA7AeeMaEnooQ2STluF76AcRipMq9aCFzGKv-MrfNhpl6wUwhxaMXtF9SSr8emWf5MEoGfm1mjPpV6J6LmHQtkQN2VJLy81BIGiDGtS_dhvdPMyS2O3dDLTA-LJSA_q4ZdbEsEbomCyfMDvS6RE_mnI06lW8dYMQ7yZA",
      "expires_in": 7200,
      "refresh_token": "IZSEC07b0edfc-f557-4e52-a995-384288e2351e"
    });
  } else {
    if (urlArray[1] == "assets") {
      var _contentType4 = 'text/html';

      var _file4 = '.' + req.url;

      fileToLoad = fs.readFileSync(_file4);
      res.writeHead(200, {
        'Content-Type': _contentType4
      });
      return res.end(fileToLoad, 'binary');
    } else {
      res.sendFile('index.html', {
        root: 'dist/'
      });
    }
  }
}); // Start the app by listening on the default to test loacally
// if(constants.HOST != "https://us-central1-syra-sharafa.cloudfunctions.net/api/" && constants.HOST != "http://localhost:5001/syra-sharafa/us-central1/api"){
//     app.listen(process.env.PORT || 8080);
// }

exports.FirebaseApp = app; // var job = new CronJob('0 22 * * 1-6', function() {
//     console.log('You will see this message at 10.pm from mon - sat', new Date());
//     getSheets()
//   }, null, true, 'Europe/Madrid');
// job.start();
// async function getDashBoardTest() {
//     var moment = require('moment');
//     var a = moment('2021-03-01');
//     var b = moment('2021-12-01');
//     let array = []
//     for (var m = moment(a); m.diff(b, 'days') <= 0; m.add(1, 'days')) {
//         console.log(m.startOf('day'),m.endOf('day'))
//         let billingInfo_current = await OrderReportRepository.getTotalBillings({start : m.startOf('day'),end : m.endOf('day')}, null)
//         let billing_info_current_json = JSON.parse(JSON.stringify(billingInfo_current[0]))
//         billing_info_current_json.avgTkt = Number(billing_info_current_json.total_amount) / Number(billing_info_current_json.count)
//         let data = billing_info_current_json
//         array.push([m.format('DD/MM/YYYY'), data.total_amount ? "€ " + data.total_amount : "€ 0.00", data.count || 0, data.avgTkt ? "€ " + data.avgTkt : "€ 0.00"])
//     }
//     console.log(array)
//     sheet.spreadsheets.values.append(
//         {
//             spreadsheetId: '1D1ing_OqL0sCNPK2rXL-OheX-bGImPAnHmivfhxuhlU',
//             range: 'sharafa',
//             valueInputOption: 'USER_ENTERED',
//             resource: {
//                 values: array
//             },
//         },
//         function (err, response) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 console.log(response);
//             }
//         });
// }
// getDashBoardTest()