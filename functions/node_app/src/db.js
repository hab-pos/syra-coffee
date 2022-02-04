const Sequelize = require('sequelize');

module.exports.sequelize = new Sequelize('sharafa', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// module.exports.sequelize = new Sequelize('heroku_d7bca21dd08ed59', 'beb19976f42123', 'ad783b06', {
//     host: 'us-cdbr-east-05.cleardb.net',
//     dialect: 'mysql',
//     logging: false
// });

// module.exports.sequelize = new Sequelize('syra_official', 'root', 'sharafa2020', {
//     host: '34.121.221.43',
//     dialect: 'mysql',
//     logging: false
// });