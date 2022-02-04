"use strict";

var _require = require('./category-repository'),
    categoryRepository = _require.categoryRepository;

var commonHelper = require('../../helpers/commonHelper');

var _require2 = require('googleapis'),
    google = _require2.google;

var moment = require('moment');

var fs = require('fs');

var os = require('os');

var _require3 = require('./category-model'),
    UserCategories = _require3.UserCategories;

module.exports.add_Category = function _callee(req, res, _) {
  var _req$body, category_name, image_name, image_url, result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, category_name = _req$body.category_name, image_name = _req$body.image_name, image_url = _req$body.image_url;
          _context.next = 3;
          return regeneratorRuntime.awrap(categoryRepository.addcategory(category_name, image_name, image_url, true, 0));

        case 3:
          result = _context.sent;
          return _context.abrupt("return", res.api(200, "Category Added Successfully", result, true));

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.uploadPhoto = function _callee2(req, res, _) {
  var file, path, ext, imageName, oAuthClient, drive, restest;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.files);

          if (!req.files) {
            _context2.next = 28;
            break;
          }

          // const files = req.files[0]
          file = req.files[0];
          path = os.tmpdir() + '/';
          ext = file.originalname.split('.').pop();
          commonHelper.prepareUploadFolder(path);
          imageName = 'Category_' + file.originalname.split('.')[0] + "_" + moment().format("DD MMM YYY HH:mm") + '.' + ext;
          _context2.prev = 7;
          fs.writeFileSync(path + imageName, file.buffer, 'utf8');
          oAuthClient = new google.auth.OAuth2(commonHelper.CLIENT_ID, commonHelper.CLIENT_SECRET, commonHelper.REDIRECT_URI);
          oAuthClient.setCredentials({
            refresh_token: commonHelper.REFRESH_TOKEN
          });
          drive = google.drive({
            version: "v3",
            auth: oAuthClient
          });
          _context2.t0 = JSON;
          _context2.t1 = JSON;
          _context2.next = 16;
          return regeneratorRuntime.awrap(uploadImageToDrive(imageName, ext, path + imageName, drive));

        case 16:
          _context2.t2 = _context2.sent;
          _context2.t3 = _context2.t1.stringify.call(_context2.t1, _context2.t2);
          restest = _context2.t0.parse.call(_context2.t0, _context2.t3);
          restest.imageName = imageName;
          return _context2.abrupt("return", res.api(200, "Image uploaded", restest, false));

        case 23:
          _context2.prev = 23;
          _context2.t4 = _context2["catch"](7);
          return _context2.abrupt("return", res.api(422, "cannot upload", _context2.t4, false));

        case 26:
          _context2.next = 29;
          break;

        case 28:
          return _context2.abrupt("return", res.api(422, "No image to upload", null, false));

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 23]]);
};

module.exports.get_category = function _callee3(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.body.id;
          categoryRepository.getCateogories(id).then(function (category) {
            res.api(200, "categories retrived successfully", {
              category: category
            }, true);
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.update_category = function _callee4(req, res, _) {
  var category, result;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          console.log("data", req.body);
          _context4.next = 3;
          return regeneratorRuntime.awrap(categoryRepository.getCateogories(req.body._id));

        case 3:
          category = _context4.sent;

          if (!category) {
            _context4.next = 11;
            break;
          }

          _context4.next = 7;
          return regeneratorRuntime.awrap(categoryRepository.update_categories(req.body));

        case 7:
          result = _context4.sent;
          return _context4.abrupt("return", res.api(200, "Category Updated", result, true));

        case 11:
          return _context4.abrupt("return", res.api(200, "Category Not available", null, false));

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.reorderCategory = function _callee5(req, res, _) {
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
          return regeneratorRuntime.awrap(categoryRepository.update_categories(req.body.list[index]));

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

module.exports.updateOnlineStatus = function _callee6(req, res, _) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(UserCategories.update({
            is_Active: req.body.is_Active
          }, {
            where: {
              _id: req.body._id
            }
          }));

        case 2:
          return _context6.abrupt("return", res.api(200, "Status updated Successfully", null, false));

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.uploadImage = function _callee7(req, res, _) {
  var _req$body2, category_name, order, id, is_Active, category, result;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body2 = req.body, category_name = _req$body2.category_name, order = _req$body2.order, id = _req$body2.id, is_Active = _req$body2.is_Active;
          _context7.next = 3;
          return regeneratorRuntime.awrap(categoryRepository.getCateogories(id));

        case 3:
          category = _context7.sent;

          if (!category) {
            _context7.next = 23;
            break;
          }

          if (!category_name) {
            _context7.next = 11;
            break;
          }

          _context7.next = 8;
          return regeneratorRuntime.awrap(categoryRepository.update_categories({
            category_name: category_name,
            id: id
          }));

        case 8:
          result = _context7.sent;
          _context7.next = 20;
          break;

        case 11:
          if (!is_Active) {
            _context7.next = 17;
            break;
          }

          _context7.next = 14;
          return regeneratorRuntime.awrap(categoryRepository.update_categories({
            is_Active: is_Active,
            id: id
          }));

        case 14:
          result = _context7.sent;
          _context7.next = 20;
          break;

        case 17:
          _context7.next = 19;
          return regeneratorRuntime.awrap(categoryRepository.update_categories({
            order: order,
            id: id
          }));

        case 19:
          result = _context7.sent;

        case 20:
          return _context7.abrupt("return", res.api(200, "Category Added", result, true));

        case 23:
          return _context7.abrupt("return", res.api(200, "Category Not available", null, false));

        case 24:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports.delete_category = function _callee8(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          id = req.body.id;
          categoryRepository.deleteCategories(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "category deleted successfully", null, true) : res.api(404, "No category found", null, false);
          });

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  });
};

function uploadImageToDrive(fileName, mime, image, drive) {
  var folderId, response;
  return regeneratorRuntime.async(function uploadImageToDrive$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(getFolderId('SharafaCategories', drive));

        case 2:
          folderId = _context9.sent;
          console.log("sucess", image, fileName, mime, folderId);
          _context9.prev = 4;
          _context9.next = 7;
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
          response = _context9.sent;
          console.log(response.data);
          return _context9.abrupt("return", shareImagePublic(response.data.id, drive));

        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](4);
          console.log(_context9.t0.message, "error");

        case 15:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[4, 12]]);
}

function shareImagePublic(fileId, drive) {
  var result;
  return regeneratorRuntime.async(function shareImagePublic$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'reader',
              type: 'anyone'
            }
          }));

        case 3:
          _context10.next = 5;
          return regeneratorRuntime.awrap(drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
          }));

        case 5:
          result = _context10.sent;
          console.log("res", result.data);
          return _context10.abrupt("return", result.data);

        case 10:
          _context10.prev = 10;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0.message);

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function getFolderId(withName, drive) {
  var result, folder;
  return regeneratorRuntime.async(function getFolderId$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive'
          })["catch"](function (e) {
            return console.log("eeee", e);
          }));

        case 2:
          result = _context11.sent;
          folder = result.data.files.filter(function (x) {
            return x.name === withName;
          });
          return _context11.abrupt("return", folder.length ? folder[0].id : null);

        case 5:
        case "end":
          return _context11.stop();
      }
    }
  });
}