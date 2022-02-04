const functions = require("firebase-functions");
var admin = require('firebase-admin');
// var serviceAccount = require("./syra-sharafa-7fddbceb3c52.json");
const { FirebaseApp,generateReportShopify } = require('./node_app/src/server')
admin.initializeApp();
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://syra-sharafa-default-rtdb.europe-west1.firebasedatabase.app"
// });
exports.api = functions.https.onRequest(FirebaseApp)

exports.report_scheduler = functions.pubsub.topic('update-sharafa-report').onPublish((data) => {
    console.log('You will see this message at 10.pm from mon - sat', new Date());
    generateReportShopify()
    // let db = admin.database()
    // var ref = db.ref("/socket_table");
    // ref.once("value", function (snapshot) {
    //     snapshot.ref.remove()
    //     return null
    // });
    return null

})