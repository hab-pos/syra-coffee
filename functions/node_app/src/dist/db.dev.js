"use strict";

var Sequelize = require('sequelize');

module.exports.sequelize = new Sequelize('syra-updated', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
}); // module.exports.sequelize = new Sequelize('heroku_92441bd5eb0fe83', 'b3c0bc18dc8da4', 'c6c06382', {
//     host: 'us-cdbr-east-02.cleardb.com',
//     dialect: 'mysql',
//     logging: false
// });
// module.exports.sequelize = new Sequelize('syra_official', 'root', 'sharafa2020', {
//     host: '34.121.221.43',
//     dialect: 'mysql',
//     logging: false
// });