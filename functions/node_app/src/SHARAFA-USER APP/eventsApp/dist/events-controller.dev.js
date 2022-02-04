"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('./events-repository'),
    EventRepository = _require.EventRepository;

var _require2 = require('./events-model'),
    EventProducts = _require2.EventProducts,
    SyraEvents = _require2.SyraEvents;

var commonHelper = require('../../helpers/commonHelper');

var _require3 = require('googleapis'),
    google = _require3.google;

var moment = require('moment');

var fs = require('fs');

var os = require('os');

var _ = require('lodash');

var _require4 = require('../Products_app/products-model'),
    UserProducts = _require4.UserProducts;

var _require5 = require('../../User_App/User-model'),
    MyCartModel = _require5.MyCartModel;

var _require6 = require('../ModifiersApp/modifier-model'),
    ModifiersModel = _require6.ModifiersModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op; // {
//     _id,
//     event_name,
//   start_date,
//   end_date,
//   reward_mode,
//   amount,
//   products,
//   thumbnail_name,
//   thumbnail_url,
//   cover_name,
//   cover_url,
//   description,
//   order,
//   is_deleted,
//   }

module.exports.addEvent = function _callee(req, res, _) {
  var request, result, index, element, event;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          request = req.body;
          request.order = 0;
          request.is_deleted = false;
          console.log(request);
          _context.next = 6;
          return regeneratorRuntime.awrap(EventRepository.addEvent(request));

        case 6:
          result = _context.sent;
          index = 0;

        case 8:
          if (!(index < req.body.products.split(',').length)) {
            _context.next = 19;
            break;
          }

          element = req.body.products.split(',')[index];
          _context.next = 12;
          return regeneratorRuntime.awrap(EventProducts.findAll({
            where: {
              SyraEventId: result._id,
              UserProductId: element
            }
          }));

        case 12:
          event = _context.sent;

          if (!(event.length == 0)) {
            _context.next = 16;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(EventProducts.create({
            SyraEventId: result._id,
            UserProductId: element
          }));

        case 16:
          index++;
          _context.next = 8;
          break;

        case 19:
          return _context.abrupt("return", res.api(200, "Event Added Successfully", result, true));

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.getEvents = function _callee2(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.body.id;
          EventRepository.getEvent(id).then(function (events) {
            res.api(200, "Events retrived successfully", events, true);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.getUserEvent = function _callee3(req, res, _) {
  var _where;

  var _req$body, id, user_id, cart_count, event;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, id = _req$body.id, user_id = _req$body.user_id;
          console.log(req.body);
          _context3.t0 = JSON;
          _context3.t1 = JSON;
          _context3.next = 6;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id || "",
              is_deleted: false
            }
          }));

        case 6:
          _context3.t2 = _context3.sent;
          _context3.t3 = _context3.t1.stringify.call(_context3.t1, _context3.t2);
          cart_count = _context3.t0.parse.call(_context3.t0, _context3.t3).toFixed(0);
          _context3.next = 11;
          return regeneratorRuntime.awrap(SyraEvents.findOne({
            where: {
              _id: id
            },
            include: [{
              model: UserProducts,
              as: "product_info",
              through: {
                attributes: []
              },
              include: [{
                model: ModifiersModel,
                as: "required_modifier_list"
              }, {
                model: ModifiersModel,
                as: "optional_modifier_list"
              }, {
                model: MyCartModel,
                as: "cart_info",
                where: (_where = {
                  "user_id": user_id,
                  "is_claiming_gift": false,
                  "is_claim_wallet": false
                }, _defineProperty(_where, Op.or, [{
                  is_reorder: false
                }, {
                  is_reorder: null
                }]), _defineProperty(_where, Op.not, [{
                  event_id: ""
                }, {
                  event_id: null
                }]), _where),
                required: false,
                include: [{
                  model: ModifiersModel,
                  as: "required_modifier_detail"
                }, {
                  model: ModifiersModel,
                  as: "optional_modifier_detail"
                }]
              }]
            }]
          }));

        case 11:
          event = _context3.sent;
          res.api(200, "Events retrived successfully", {
            event: event,
            cart_count: cart_count
          }, true);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.updateEvent = function _callee4(req, res, _) {
  var eventDetails, product_list, unLinkedList, index, element, event, _index, _element;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(EventRepository.getEvent(req.body._id));

        case 2:
          eventDetails = _context4.sent;
          _context4.next = 5;
          return regeneratorRuntime.awrap(UserProducts.findAll({
            where: {
              is_deleted: false
            }
          }));

        case 5:
          _context4.t0 = function (data) {
            return data._id;
          };

          product_list = _context4.sent.map(_context4.t0);
          unLinkedList = commonHelper.diffArray(product_list, req.body.products.split(',')); // console.log("unlinked\n", unLinkedList,"\nlist\n",product_list,"\nparam\n",req.body.products.split(','))

          if (!eventDetails) {
            _context4.next = 46;
            break;
          }

          _context4.next = 11;
          return regeneratorRuntime.awrap(EventRepository.updateEvent(req.body));

        case 11:
          console.log(req.body.products.split(','));

          if (!req.body.products) {
            _context4.next = 43;
            break;
          }

          index = 0;

        case 14:
          if (!(index < req.body.products.split(',').length)) {
            _context4.next = 32;
            break;
          }

          element = req.body.products.split(',')[index];
          _context4.next = 18;
          return regeneratorRuntime.awrap(EventProducts.findAll({
            where: {
              SyraEventId: req.body._id,
              UserProductId: element
            }
          }));

        case 18:
          event = _context4.sent;
          console.log(event.length == 0);

          if (!(event.length == 0)) {
            _context4.next = 29;
            break;
          }

          _context4.prev = 21;
          _context4.next = 24;
          return regeneratorRuntime.awrap(EventProducts.create({
            SyraEventId: req.body._id,
            UserProductId: element
          }));

        case 24:
          _context4.next = 29;
          break;

        case 26:
          _context4.prev = 26;
          _context4.t1 = _context4["catch"](21);
          console.log(_context4.t1);

        case 29:
          index++;
          _context4.next = 14;
          break;

        case 32:
          _index = 0;

        case 33:
          if (!(_index < unLinkedList.length)) {
            _context4.next = 40;
            break;
          }

          _element = unLinkedList[_index];
          _context4.next = 37;
          return regeneratorRuntime.awrap(EventProducts.destroy({
            where: {
              SyraEventId: req.body._id,
              UserProductId: _element
            }
          }));

        case 37:
          _index++;
          _context4.next = 33;
          break;

        case 40:
          return _context4.abrupt("return", res.api(200, "Event details Updated", eventDetails, true));

        case 43:
          return _context4.abrupt("return", res.api(200, "Event details Updated", eventDetails, true));

        case 44:
          _context4.next = 47;
          break;

        case 46:
          return _context4.abrupt("return", res.api(200, "Event Not available", null, false));

        case 47:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[21, 26]]);
};

module.exports.reorderEvent = function _callee5(req, res, _) {
  var index;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          index = 0;

        case 1:
          if (!(index < req.body.list.length)) {
            _context5.next = 7;
            break;
          }

          _context5.next = 4;
          return regeneratorRuntime.awrap(EventRepository.updateProduct(req.body.list[index]));

        case 4:
          index++;
          _context5.next = 1;
          break;

        case 7:
          return _context5.abrupt("return", res.api(200, "Reordered Successfully", null, false));

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.deleteEvent = function _callee6(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.body.id;
          EventRepository.deleteEvent(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "Event deleted successfully", null, true) : res.api(404, "No product found", null, false);
          });

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.uploadPhoto = function _callee7(req, res, _) {
  var type, file, path, ext, imageName, oAuthClient, drive, restest;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          type = req.body.type || "events";
          console.log(req.files);

          if (!req.files) {
            _context7.next = 29;
            break;
          }

          file = req.files[0];
          path = os.tmpdir() + '/';
          ext = file.originalname.split('.').pop();
          commonHelper.prepareUploadFolder(path);
          imageName = type + '_' + file.originalname.split('.')[0] + "_" + moment().format("DD MMM YYY HH:mm") + '.' + ext;
          _context7.prev = 8;
          fs.writeFileSync(path + imageName, file.buffer, 'utf8');
          oAuthClient = new google.auth.OAuth2(commonHelper.CLIENT_ID, commonHelper.CLIENT_SECRET, commonHelper.REDIRECT_URI);
          oAuthClient.setCredentials({
            refresh_token: commonHelper.REFRESH_TOKEN
          });
          drive = google.drive({
            version: "v3",
            auth: oAuthClient
          });
          _context7.t0 = JSON;
          _context7.t1 = JSON;
          _context7.next = 17;
          return regeneratorRuntime.awrap(uploadImageToDrive(imageName, ext, path + imageName, drive, type));

        case 17:
          _context7.t2 = _context7.sent;
          _context7.t3 = _context7.t1.stringify.call(_context7.t1, _context7.t2);
          restest = _context7.t0.parse.call(_context7.t0, _context7.t3);
          restest.imageName = imageName;
          return _context7.abrupt("return", res.api(200, "Image uploaded", restest, false));

        case 24:
          _context7.prev = 24;
          _context7.t4 = _context7["catch"](8);
          return _context7.abrupt("return", res.api(422, "cannot upload", null, false));

        case 27:
          _context7.next = 30;
          break;

        case 29:
          return _context7.abrupt("return", res.api(422, "No image to upload", null, false));

        case 30:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[8, 24]]);
};

function uploadImageToDrive(fileName, mime, image, drive) {
  var folderId, response;
  return regeneratorRuntime.async(function uploadImageToDrive$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(getFolderId('EVENTS', drive));

        case 2:
          folderId = _context8.sent;
          console.log("sucess", image, fileName, mime, folderId);
          _context8.prev = 4;
          _context8.next = 7;
          return regeneratorRuntime.awrap(drive.files.create({
            requestBody: {
              name: fileName,
              mimeType: "image/" + mime,
              parents: [folderId]
            },
            media: {
              mimeType: "image/" + mime,
              body: fs.createReadStream(image)
            }
          }));

        case 7:
          response = _context8.sent;
          console.log(response.data);
          return _context8.abrupt("return", shareImagePublic(response.data.id, drive));

        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](4);
          console.log(_context8.t0.message, "error");

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[4, 12]]);
}

function shareImagePublic(fileId, drive) {
  var result;
  return regeneratorRuntime.async(function shareImagePublic$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'reader',
              type: 'anyone'
            }
          }));

        case 3:
          _context9.next = 5;
          return regeneratorRuntime.awrap(drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
          }));

        case 5:
          result = _context9.sent;
          console.log("res", result.data);
          return _context9.abrupt("return", result.data);

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0.message);

        case 13:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function getFolderId(withName, drive) {
  var result, folder;
  return regeneratorRuntime.async(function getFolderId$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive'
          })["catch"](function (e) {
            return console.log("eeee", e);
          }));

        case 2:
          result = _context10.sent;
          folder = result.data.files.filter(function (x) {
            return x.name === withName;
          });
          return _context10.abrupt("return", folder.length ? folder[0].id : null);

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
}