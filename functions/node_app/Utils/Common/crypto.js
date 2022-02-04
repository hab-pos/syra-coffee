var bcrypt = require('bcrypt');

exports.encryptPassword = function(password, callback) {
    bcrypt.genSalt(10, function(err, salt) {
     if (err) 
       return callback(err);
 
     bcrypt.hash(password, salt, function(err, hash) {
       return callback(err, hash);
     });
   });
 };
 
 exports.comparePassword = function(plainPass, hashword) {
    return bcrypt.compare(plainPass, hashword);
 };
 