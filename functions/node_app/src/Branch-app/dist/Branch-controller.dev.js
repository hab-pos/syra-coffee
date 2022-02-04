"use strict";

var _require = require('./branch-repository'),
    branchRepository = _require.branchRepository;

module.exports.add_branch = function _callee(req, res, _) {
  var _req$body, created_by, branch_name, device_id, lat, lng, show_on_app, espresso_report_date;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, created_by = _req$body.created_by, branch_name = _req$body.branch_name, device_id = _req$body.device_id, lat = _req$body.lat, lng = _req$body.lng, show_on_app = _req$body.show_on_app, espresso_report_date = _req$body.espresso_report_date;
          branchRepository.addBranch(branch_name, device_id, created_by, lat, lng, show_on_app, espresso_report_date).then(function (branchInfo) {
            res.api(200, "Branch saved", {
              branchInfo: branchInfo
            }, true);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.get_branch = function _callee2(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.body.id;
          branchRepository.getBranches(id).then(function (branch_list) {
            res.api(200, "branches retrived successfully", {
              branch_list: branch_list
            }, true);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.update_branch = function _callee3(req, res, _) {
  var _req$body2, id, branch_name, device_id, lat, lng, show_on_app, espresso_report_date, query;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(req.body);
          _req$body2 = req.body, id = _req$body2.id, branch_name = _req$body2.branch_name, device_id = _req$body2.device_id, lat = _req$body2.lat, lng = _req$body2.lng, show_on_app = _req$body2.show_on_app, espresso_report_date = _req$body2.espresso_report_date;
          query = branch_name != null && branch_name != undefined && device_id != null && device_id != undefined ? {
            "branch_name": branch_name,
            "device_id": device_id,
            "lat": lat,
            "lng": lng,
            "show_on_app": show_on_app,
            "espresso_report_date": espresso_report_date
          } : branch_name != null && branch_name != undefined ? {
            "branch_name": branch_name,
            "lat": lat,
            "lng": lng,
            "show_on_app": show_on_app,
            "espresso_report_date": espresso_report_date
          } : {
            "device_id": device_id,
            "lat": lat,
            "lng": lng,
            "show_on_app": show_on_app,
            "espresso_report_date": espresso_report_date
          };
          branchRepository.update_branch(id, query).then(function (update_success) {
            update_success[0] > 0 ? res.api(200, "branch updated successfully", null, true) : res.api(404, "no branch found", null, false);
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.delete_branch = function _callee4(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.body.id;
          branchRepository.deleteBranch(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "currency deleted successfully", null, true) : res.api(404, "No currency found", null, false);
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};