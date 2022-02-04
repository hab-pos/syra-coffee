"use strict";

var _require = require("../emitters/admin-emitter"),
    catelougeEmitter = _require.catelougeEmitter;

var _require2 = require("./catelouge-repository"),
    catelougeRepository = _require2.catelougeRepository;

var addCatelougeMiddelware = function addCatelougeMiddelware() {
  catelougeEmitter.on('insertd.catelouge', function (data) {
    console.log(data.data.catelouge, "inside");
    data.data.ids.forEach(function (element) {
      catelougeRepository.delete_Relation(data.data.catelouge._id).then(function () {
        catelougeRepository.checkUniquenessinMiddleware(element, data.data.catelouge._id).then(function (res) {
          if (res.length == 0) {
            catelougeRepository.insert_middelware(element, data.data.catelouge._id).then(function () {
              console.log("finished");
            });
          }
        });
      });
    });
  });
};

module.exports.addCatelougeMiddelware = addCatelougeMiddelware;