"use strict";

var _require = require('./products-repository'),
    ProductRepository = _require.ProductRepository;

var _require2 = require('./products-model'),
    UserProducts = _require2.UserProducts;

var commonHelper = require('../../helpers/commonHelper');

var _require3 = require('googleapis'),
    google = _require3.google;

var moment = require('moment');

var fs = require('fs');

var os = require('os');

var _ = require('lodash');

module.exports.addProduct = function _callee(req, res, _) {
  var request, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          request = req.body;
          request.order = 0;
          request.is_Active = true;
          request.is_deleted = false;
          console.log(request);
          _context.next = 7;
          return regeneratorRuntime.awrap(ProductRepository.addProduct(request));

        case 7:
          result = _context.sent;
          return _context.abrupt("return", res.api(200, "product Added Successfully", result, true));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.getProducts = function _callee2(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.body.id;
          ProductRepository.getProducts(id).then(function (modifiers) {
            res.api(200, "products retrived successfully", modifiers, true);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.updateProduct = function _callee3(req, res, _) {
  var category, result;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(ProductRepository.getProducts(req.body._id));

        case 2:
          category = _context3.sent;

          if (!category) {
            _context3.next = 10;
            break;
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(ProductRepository.updateProduct(req.body));

        case 6:
          result = _context3.sent;
          return _context3.abrupt("return", res.api(200, "product Updated", result, true));

        case 10:
          return _context3.abrupt("return", res.api(200, "product Not available", null, false));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.reorderCategory = function _callee4(req, res, _) {
  var index;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          index = 0;

        case 1:
          if (!(index < req.body.list.length)) {
            _context4.next = 7;
            break;
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(ProductRepository.updateProduct(req.body.list[index]));

        case 4:
          index++;
          _context4.next = 1;
          break;

        case 7:
          return _context4.abrupt("return", res.api(200, "Reordered Successfully", null, false));

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.updateOnlineStatus = function _callee5(req, res, _) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(UserProducts.update({
            is_Active: req.body.is_Active
          }, {
            where: {
              _id: req.body._id
            }
          }));

        case 2:
          return _context5.abrupt("return", res.api(200, "Status updated Successfully", null, false));

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.deleteProduct = function _callee6(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.body.id;
          ProductRepository.deleteProduct(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "product deleted successfully", null, true) : res.api(404, "No product found", null, false);
          });

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
};

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

module.exports.get_all_products = function _callee7(req, res, next) {
  var products, grouped;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(ProductRepository.getProducts(null));

        case 2:
          products = _context7.sent;
          grouped = _(products).groupBy("category").map(function (data, key) {
            return {
              category_id: key,
              category_details: data[0].category_details,
              products: data,
              type: "product",
              count: data.length
            };
          });
          grouped = JSON.parse(JSON.stringify(grouped));
          grouped.insert(0, {
            category_id: "",
            category_details: {},
            products: [],
            type: "wallet",
            count: 0
          });
          grouped.insert(0, {
            category_id: "",
            category_details: {},
            products: [],
            type: "reorder",
            count: 0
          });
          res.api(404, "Products retrived successfully", grouped, false);

        case 8:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports.getFeaturedProducts = function _callee8(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          id = req.body.id;
          ProductRepository.getFeaturedProducts().then(function (response) {
            return res.api(404, "Featured products retrived successfully", response, false);
          });

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports.uploadPhoto = function _callee9(req, res, _) {
  var file, path, ext, imageName, oAuthClient, drive, restest;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          console.log(req.files);

          if (!req.files) {
            _context9.next = 28;
            break;
          }

          file = req.files[0];
          path = os.tmpdir();
          ext = file.originalname.split('.').pop();
          commonHelper.prepareUploadFolder(path);
          imageName = 'Product_' + file.originalname.split('.')[0] + "_" + moment().format("DD MMM YYY HH:mm") + '.' + ext;
          _context9.prev = 7;
          fs.writeFileSync(path + imageName, file.buffer, 'utf8');
          oAuthClient = new google.auth.OAuth2(commonHelper.CLIENT_ID, commonHelper.CLIENT_SECRET, commonHelper.REDIRECT_URI);
          oAuthClient.setCredentials({
            refresh_token: commonHelper.REFRESH_TOKEN
          });
          drive = google.drive({
            version: "v3",
            auth: oAuthClient
          });
          _context9.t0 = JSON;
          _context9.t1 = JSON;
          _context9.next = 16;
          return regeneratorRuntime.awrap(uploadImageToDrive(imageName, ext, path + imageName, drive));

        case 16:
          _context9.t2 = _context9.sent;
          _context9.t3 = _context9.t1.stringify.call(_context9.t1, _context9.t2);
          restest = _context9.t0.parse.call(_context9.t0, _context9.t3);
          restest.imageName = imageName;
          return _context9.abrupt("return", res.api(200, "Image uploaded", restest, false));

        case 23:
          _context9.prev = 23;
          _context9.t4 = _context9["catch"](7);
          return _context9.abrupt("return", res.api(422, "cannot upload", null, false));

        case 26:
          _context9.next = 29;
          break;

        case 28:
          return _context9.abrupt("return", res.api(422, "No image to upload", null, false));

        case 29:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[7, 23]]);
};

function uploadImageToDrive(fileName, mime, image, drive) {
  var folderId, response;
  return regeneratorRuntime.async(function uploadImageToDrive$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(getFolderId('SHARAFA-PRODUCTS', drive));

        case 2:
          folderId = _context10.sent;
          console.log("sucess", image, fileName, mime, folderId);
          _context10.prev = 4;
          _context10.next = 7;
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
          response = _context10.sent;
          console.log(response.data);
          return _context10.abrupt("return", shareImagePublic(response.data.id, drive));

        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](4);
          console.log(_context10.t0.message, "error");

        case 15:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[4, 12]]);
}

function shareImagePublic(fileId, drive) {
  var result;
  return regeneratorRuntime.async(function shareImagePublic$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'reader',
              type: 'anyone'
            }
          }));

        case 3:
          _context11.next = 5;
          return regeneratorRuntime.awrap(drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
          }));

        case 5:
          result = _context11.sent;
          console.log("res", result.data);
          return _context11.abrupt("return", result.data);

        case 10:
          _context11.prev = 10;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0.message);

        case 13:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function getFolderId(withName, drive) {
  var result, folder;
  return regeneratorRuntime.async(function getFolderId$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive'
          })["catch"](function (e) {
            return console.log("eeee", e);
          }));

        case 2:
          result = _context12.sent;
          folder = result.data.files.filter(function (x) {
            return x.name === withName;
          });
          return _context12.abrupt("return", folder.length ? folder[0].id : null);

        case 5:
        case "end":
          return _context12.stop();
      }
    }
  });
}