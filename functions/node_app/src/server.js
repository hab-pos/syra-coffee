const { app } = require('./index')
//Install express server
const express = require('express');
var cors = require('cors')
const fs = require('fs');
const { constants } = require('../Utils/constants');
let os = require('os')
const moment = require('moment');

const path = require('path')
const { google } = require('googleapis')
var CronJob = require('cron').CronJob; 
// const { OrderReportRepository } = require("./reports-repository")
const { OrderReportRepository } = require("./OrdersApp/reports-repository")

const CLIENT_ID = "987244501943-32npfb477vnv5anufsfol6mbpeb9n5f4.apps.googleusercontent.com"
const CLIENT_SECRET = "z2aG1AdiLfR9XPQUNpRtwavk"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04GrhO0Od_oecCgYIARAAGAQSNwF-L9Irf96ALvW3zqtJ5CxeR7R4Vkndc-odAJQO_WcOVP3qTkkE6nGA1nkJLhbH1D8Qq6HIr6Y"

const oAuthClient = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
)

oAuthClient.setCredentials({ refresh_token: REFRESH_TOKEN })

const sheet = google.sheets({
    version: "v4",
    auth: oAuthClient
})

async function getDashBoard() {

    let billingInfo_current = await OrderReportRepository.getTotalBillings(null, null)
    let billing_info_current_json = JSON.parse(JSON.stringify(billingInfo_current[0]))
    billing_info_current_json.avgTkt = Number(billing_info_current_json.total_amount) / Number(billing_info_current_json.count)
    return billing_info_current_json
}  

exports.generateReportShopify = async function getSheets() {
    let data = await getDashBoard()
    sheet.spreadsheets.values.append(
        {
            spreadsheetId: '1D1ing_OqL0sCNPK2rXL-OheX-bGImPAnHmivfhxuhlU',
            range: 'sharafa',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [
                    [moment().format('DD/MM/YYYY'), data.total_amount ? "€ " + data.total_amount : "€ 0.00" , data.count || 0, data.avgTkt ? "€ " + data.avgTkt : "€ 0.00"],
                ]
            },
        },
        function (err, response) {
            if (err) {
                console.log(err);                
            }
            else{
                console.log(response);
            }
        });
}


app.use(express.static('./dist'));
app.use(cors())
app.post('/paycomet', (req, res) =>{
    var request = require("request");
    let reqObject = {
        "terminal": 37218,
        "jetToken": req.body.paytpvToken
    }
    var options = {
        url: "https://rest.paycomet.com/v1/cards",
        json: true,
        method: 'POST',
        body : reqObject,
        headers: {
            'Content-Type': 'application/json',
            'PAYCOMET-API-TOKEN': '0e83be0eb768b480ba47e12633bf4ea74058566d'
        }
    };

    request(options, function (err, response) {
        if (err) {
            console.log(err);
            return res.redirect('/api/url-ko')
        }
        console.log(response)
        return res.redirect('/api/user-created?user='+response.body.idUser+"&token="+response.body.tokenUser+"&user_name="+req.body.username);
    });
    // const request = require('request-promise');
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
})
app.get('/*', (req, res) => {
    let urlArray = req.url.split("/");
    console.log(req.query);
    if ((urlArray[1] == "assets" && urlArray[2] == 'logos') || (urlArray[1] == "assets" && urlArray[2] == 'icons')) {
        const pathImage = urlArray[3];
        const extension = pathImage.split('.').pop();
        const contentType = 'image/' + extension;
        const file = '.' + req.url
        try{
            fileToLoad = fs.readFileSync(file);
        }
        catch(err){
            fileToLoad = fs.readFileSync('./functions/' + req.url);
        }
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(fileToLoad, 'binary');
    } 
    else if(urlArray[1] == "assets" && urlArray[2] == 'reciepts'){
        const pathImage = urlArray[3];
        const extension = pathImage.split('.').pop();
        const contentType = 'application/' + extension;
        const file = os.tmpdir()+"/"+pathImage
        fileToLoad = fs.readFileSync(file);
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(fileToLoad, 'binary');
    }
    else if(urlArray[1] == "assets" && urlArray[2] == 'reports'){
        const pathImage = urlArray[3];
        const extension = pathImage.split('.').pop();
        const contentType = 'application/' + extension;
        const file = os.tmpdir()+'/report.pdf'
        fileToLoad = fs.readFileSync(file);
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(fileToLoad, 'binary');
    }
    else if(urlArray[1] == "assets" && urlArray[2] == 'fonts'){
        const pathImage = urlArray[3];
        const extension = pathImage.split('.').pop();
        const contentType = 'font/' + extension;
        const file = '.' + req.url
        try{
            fileToLoad = fs.readFileSync(file);
        }
        catch(err){
            fileToLoad = fs.readFileSync('./functions/' + req.url);
        }
        res.writeHead(200, { 'Content-Type': contentType });
        return res.end(fileToLoad, 'binary');
    }
    else if(urlArray[1] && urlArray[1].includes('get_token'))
    {
        res.json({
            "access_token": "eyJraWQiOiIxNDQ0NzI3MTY0Njk4IiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJpWmV0dGxlIiwiYXVkIjoiQVBJIiwiZXhwIjoxNDQ0ODI1MzI1LCJqdGkiOiJXeE1vXzFaNFJQMWQ5Mi10N2owUXBRIiwiaWF0IjoxNDQ0ODIzNTI1LCJuYmYiOjE0NDQ4MjM0MDUsInN1YiI6IlllemNseEJlVHBLUDBqNXRBdmdqWXciLCJzY29wZSI6ImFsbCJ9.O-mh4Wyt-ReS-5tH2YBN2CVh1-UnyMf2xoF6Qie3pa2YGZY_u2UTU2bp0KiGjmHHLgYI5c9N1F6s7Ze-KpAyH1WZHSW8mezt25qBLpvCgr4OFkRGY7QYVa-UhVXkQ0B_shviiwubenTNCGdQl9fJlJmElqb5SQl2Tl7sraKV4T1cp5dpPZmA7AeeMaEnooQ2STluF76AcRipMq9aCFzGKv-MrfNhpl6wUwhxaMXtF9SSr8emWf5MEoGfm1mjPpV6J6LmHQtkQN2VJLy81BIGiDGtS_dhvdPMyS2O3dDLTA-LJSA_q4ZdbEsEbomCyfMDvS6RE_mnI06lW8dYMQ7yZA",
            "expires_in": 7200,
            "refresh_token": "IZSEC07b0edfc-f557-4e52-a995-384288e2351e"
        });
    }
    else {
        if(urlArray[1] == "assets"){
            const contentType = 'text/html';
            const file = '.' + req.url
            try{
                fileToLoad = fs.readFileSync(file);
            }
            catch(err){
                fileToLoad = fs.readFileSync('./functions/' + req.url);
            }
            res.writeHead(200, { 'Content-Type': contentType });
            return res.end(fileToLoad, 'binary');
        }
        else{
            res.sendFile('index.html', { root: 'dist/' })
        } 
    }
});

// Start the app by listening on the default to test loacally
// if(constants.HOST != "https://us-central1-syra-sharafa.cloudfunctions.net/api/" && constants.HOST != "http://localhost:5001/syra-sharafa/us-central1/api/"){
    app.listen(process.env.PORT || 8080);
// }
// exports.FirebaseApp = app
var admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "syra-sharafa",
    "private_key_id": "a4cb59b7086312166b487ac29e68031f81c2c0f0",
    "private_key": ("-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGm9CuMdT/ZWEc\nwqs7jCtpyy2lCgpvxCeaaq6sb9v0NTH07H5FZHr79FC6z3xtiysm7DBCknZNadND\nyiXAoNvGrXtCjHSgjSYb1p+EZ4Yl3/0ClzRF9cs1VVFp9ksUWJUwuTI18grNHpG9\nmMKzY1+KzaQaMnxdR/pNsHjFLKMQNc3BWJxysnaxADdZBU8hjeDNkOW+pE9Dyn2K\niharCSrICgFNtkjDVovbTaahmkC4KwG+effaK019ESpALY7HbPsOzISmTB+OSVKf\nr8Hd9pq24xXXhsEadyAGo4kiJItXJ0h17vlNKzSf9j9QMdNqRaVl8XhiqQOrtqyP\nJy73Sm8ZAgMBAAECggEAMXc97KDbMsgKfaoLkV96MZWJ9wzO6CLkFTzkZ+zNTN/R\n4zVixsA9tFKXp8uFK1hp5T4W0AHgBqxokr3+lKFL08pCBKNsac918iGMpeLN4dGN\nl89WlOUg2VX4WsqdzQG6GMJLe+2enJN0S5NITPsfYPgSWvb/jBEhCaf+EGfrbh3z\nyqUyxDe4phNsQY2qzVTLCxjrEnsYR/vtce2MMr2HVDpfnSMgRGfdB0cDRRL89fzC\nu3aTBOPfMYGEgClGL7tXG6vNDOOPqYSYLN9YR9gbmiDNMVu3vCrWgmWF6yNz8+aW\nECvqkFMD43fQ7QBDIg6iUx8wfl5Cpjm3qyI5OqLnPQKBgQDznGfkEoHt/S0bMgwa\n538aNu7iIL4xFvK83H4C4eKFeZRkORmxKyG1+achqIAsvNzbQW28+vIuFZASRwYs\nBeA81GWVyDSv+nTbE0n1JKacSQuQh1jOuTD4mKM059iDvby6Jtpd8hgRhECiicdz\nhX98tNd2atgB7u8fg6EvU4FXHQKBgQDQtYUgwmyYt/bI93UJUP9ZU4DsRPVUr7Il\n+ZFh27eBqlK4UaMJJL/RJ5BDfBRlZ1Ok3hnjA0gRX5Cm1inMrOTeNPYW/LpPP5LN\n7zRHuERwliZ7mT46ltcgd2YxdF8fgeHgpdm7EXZfOlAVCDydkIR0SGvEwQCIJnk8\nhQ29GKlrLQKBgErHJujOeY2pGnBvo2Gaz9wnIprM/DSrW6V3dULDPbpFALTnBijp\nGXb3hEMDqxyQeKbg5aON0EsvGUNTA+T9hMCHXgtlIi8mjTo2KIyUTIRKs78QnMUP\n+aVFjUuPI1oFIuptRLhzuMmftAtwiYW/Y8vO4xiZYWbuhf5BdHfHhTtNAoGASmRp\nT4P9sXHhRUDvNqLoYa6iBZWO3ODDX0XVzEvE3TMYyRpQQrIWrTas9WEE5CAwcFO6\nZnCE/6xQoyczPwFhktLN5OOwhQ7kBQN+XxIPUxIyJVw6EigyBiCJDJeuUEy7dpen\nREa1KrxeTyDgeklI7SnjP/6LcfxEuo2yl/RybwECgYAtKQVUtwOUjiePh6JEjHVj\noXVeMmyLvJfkW15Gm9HyRV7SzutbDbfAyzv+Ow77SW4zkuUkY2d+vER0hLKGA9KI\nRpNjoGdAtKmnYKZsPKdavw63emG1dPkXu76TdhETWigWXUCtVzxR0O7JXfDxcThM\ntNIvzurfCmaFCB0lFeFh/g==\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-yv0lu@syra-sharafa.iam.gserviceaccount.com",
    "client_id": "103900986967708616416",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yv0lu%40syra-sharafa.iam.gserviceaccount.com"
    }),
    databaseURL: "https://syra-sharafa-default-rtdb.europe-west1.firebasedatabase.app"
});

var job = new CronJob('0 22 * * 1-6', function() {
    console.log('You will see this message at 10.pm from mon - sat', new Date());
    let db = admin.database()
    var ref = db.ref("/socket_table");
    ref.once("value", function (snapshot) {
        snapshot.ref.remove()
        return null
    });
  }, null, true, 'Europe/Madrid');
  
job.start();


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