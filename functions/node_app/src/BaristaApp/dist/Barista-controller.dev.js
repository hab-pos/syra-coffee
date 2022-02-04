"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('./Barista-repository'),
    baristaRepository = _require.baristaRepository;

var _require2 = require('../../Utils/Common/crypto'),
    encryptPassword = _require2.encryptPassword,
    comparePassword = _require2.comparePassword;

var _require3 = require('../../Utils/constants'),
    time_slot_hour = _require3.time_slot_hour,
    constants = _require3.constants;

var _require4 = require('./Barista-emitter'),
    barista_logged_in = _require4.barista_logged_in;

var moment = require("moment");

var _require5 = require('./Barista-model'),
    ClockinModel = _require5.ClockinModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var _ = require('lodash');

module.exports.addBarista = function _callee(req, res, _) {
  var _req$body, barista_name, password, created_by;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, barista_name = _req$body.barista_name, password = _req$body.password, created_by = _req$body.created_by;
          _context.next = 3;
          return regeneratorRuntime.awrap(encryptPassword(password, function (err, hash) {
            if (err) {
              return res.api(500, "Internel server Error!,Could not generate password hash", null, false);
            }

            baristaRepository.addBarista(barista_name, hash, created_by).then(function (barista) {
              return res.api(200, 'Barista created successfullty', {
                barista: barista
              }, true);
            });
          }));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.barista_login = function _callee2(req, res, _) {
  var _req$body2, barista_name, password, device_id, type, branch_info, result, current_hour, current_time_slot, time_slot, i, current_pair, isActive, info;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, barista_name = _req$body2.barista_name, password = _req$body2.password, device_id = _req$body2.device_id, type = _req$body2.type;
          _context2.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.get_branchInfo(device_id || ""));

        case 3:
          branch_info = _context2.sent;

          if (!branch_info) {
            _context2.next = 36;
            break;
          }

          _context2.next = 7;
          return regeneratorRuntime.awrap(baristaRepository.compare_password(barista_name, password));

        case 7:
          result = _context2.sent;

          if (!(result.barista_details != null)) {
            _context2.next = 33;
            break;
          }

          current_hour = moment().utc().tz(constants.TIME_ZONE).format('H');
          current_time_slot = "";
          time_slot = time_slot_hour();

          for (i = 0; i < time_slot.length; ++i) {
            current_pair = time_slot[i].split('-');

            if (parseInt(current_pair[0]) == current_hour) {
              current_time_slot = i;
            }
          }

          isActive = type == "logged_in" ? true : false;
          _context2.next = 16;
          return regeneratorRuntime.awrap(baristaRepository.getClockinRecord(branch_info._id, result.barista_details._id));

        case 16:
          info = _context2.sent;

          if (!(info && type == "checked_in")) {
            _context2.next = 21;
            break;
          }

          res.api(422, "Already checked in", null, false);
          _context2.next = 31;
          break;

        case 21:
          if (!info) {
            _context2.next = 25;
            break;
          }

          return _context2.abrupt("return", result.status == true ? barista_logged_in(result.barista_details, res) : res.api(422, "invalid password", null, false));

        case 25:
          if (!(result.status == true)) {
            _context2.next = 30;
            break;
          }

          baristaRepository.addClockin(result.barista_details._id, branch_info._id, current_time_slot, type, isActive);
          return _context2.abrupt("return", barista_logged_in(result.barista_details, res));

        case 30:
          return _context2.abrupt("return", res.api(422, "invalid password", null, false));

        case 31:
          _context2.next = 34;
          break;

        case 33:
          return _context2.abrupt("return", res.api(404, "Not registered barista, please contact admin", null, false));

        case 34:
          _context2.next = 37;
          break;

        case 36:
          return _context2.abrupt("return", res.api(404, "IPAD not registered to any Branch", null, false));

        case 37:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.get_barista_details_by_id = function _callee3(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.body.id;
          _context3.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.get_barista_details({
            "_id": id
          }).then(function (barista_details) {
            return barista_details ? res.api(200, "barista detail retrived successfully", {
              barista_details: barista_details
            }, true) : res.api(200, "No Barista found", {
              barista_details: barista_details
            }, false);
          }));

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.get_report = function _callee4(req, res) {
  var _req$body3, dates, branch, data, dataJson, grouped, response, _loop, _i, _Object$entries, totalHours, totalMins, totDiffMins, totDiffHours;

  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body3 = req.body, dates = _req$body3.dates, branch = _req$body3.branch;
          _context5.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.getReport(dates, branch));

        case 3:
          data = _context5.sent;
          dataJson = JSON.parse(JSON.stringify(data));
          grouped = _.groupBy(dataJson, function (data, key) {
            return data.barista_id;
          });
          response = [];

          _loop = function _loop() {
            var _Object$entries$_i, key, value, item, branch_array, datesArray, data;

            return regeneratorRuntime.async(function _loop$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
                    item = Object();
                    branch_array = [];
                    datesArray = [];
                    totalHours = 0;
                    totalMins = 0;
                    totDiffMins = 0;
                    totDiffHours = 0;
                    value.forEach(function (element, index) {
                      if (!branch_array.includes(element.branch_id)) {
                        branch_array.push(element.branch_id);
                      }

                      if (!datesArray.includes(moment(element.createdAt).format("DD MM YYYY"))) {
                        datesArray.push(moment(element.createdAt).format("DD MM YYYY"));
                      }

                      var m1 = moment(element.loginTime);
                      var m2 = moment(element.logoutTime || new Date());
                      var m3 = m2.diff(m1, 'minutes');
                      var m4 = m2.diff(m1, 'hours', true);
                      totDiffMins += Math.floor(m3 % 1440);
                      console.log(m4, "diff", element.barista_id);
                    });
                    totalHours = Math.floor(totDiffMins / 60);
                    totalMins = Math.floor(totDiffMins % 60);
                    _context4.next = 13;
                    return regeneratorRuntime.awrap(baristaRepository.getBarista_transaction(dates, branch, key));

                  case 13:
                    data = _context4.sent;
                    item.barista_id = key;
                    item.color = value[0].barista_info.color;
                    item.barista_name = value[0].barista_info.barista_name;
                    item.no_of_branches_worked = branch_array.length;
                    item.no_days_worked = datesArray.length;
                    item.hours = totalHours + "h " + totalMins + "m";
                    item.txn_data = data[0];
                    response.push(item);

                  case 22:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          };

          _i = 0, _Object$entries = Object.entries(grouped);

        case 9:
          if (!(_i < _Object$entries.length)) {
            _context5.next = 15;
            break;
          }

          _context5.next = 12;
          return regeneratorRuntime.awrap(_loop());

        case 12:
          _i++;
          _context5.next = 9;
          break;

        case 15:
          return _context5.abrupt("return", res.api(200, "barista detail retrived successfully", response, true));

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  });
};

function getTimeAsNumber(time) {
  var login_time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var time_to_cast = "";

  if (time == null) {
    if (Number(moment(login_time).format("DD")) < Number(moment().format("DD"))) {
      console.log(time, Number(moment(login_time).format("DD")), Number(moment().format("DD")), "gurutcesas");
      time_to_cast = moment(login_time);
    } else {
      time_to_cast = moment();
    }
  } else {
    time_to_cast = moment(time);
  }

  var hr = Number(time_to_cast.format("HH")) + 2;
  var mins = Math.round(Number(time_to_cast.format('mm')) / 60 * 10);
  return Number(hr + "." + mins);
}

module.exports.get_report_graph = function _callee5(req, res) {
  var _req$body4, dates, branch, data, dataJson, grouped, array, branches, colors, response, baristas, index, element, item, from, to, logInTime, logoutTime, index_j, element_item, record, _index_j, _element_item, _from, _to, _record, _index_j2, _element_item2, _from2, _to2, _record2;

  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body4 = req.body, dates = _req$body4.dates, branch = _req$body4.branch;
          _context6.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.getReportGraph(dates, branch));

        case 3:
          data = _context6.sent;
          dataJson = JSON.parse(JSON.stringify(data));
          grouped = _.groupBy(dataJson, function (data, key) {
            return data.barista_info.barista_name;
          });
          array = Object.values(grouped);
          branches = [];
          colors = [];
          response = [];
          baristas = [];

          for (index = 0; index < array.length; index++) {
            element = array[index];
            item = [];

            if (element.length > 1) {
              if (dates == null || dates.end == null || dates.start == dates.end) {
                from = 25;
                to = 0;
                logInTime = "";
                logoutTime = "";

                for (index_j = 0; index_j < element.length; index_j++) {
                  element_item = element[index_j];

                  if (from > getTimeAsNumber(element_item.loginTime)) {
                    from = getTimeAsNumber(element_item.loginTime);
                    logInTime = element_item.loginTime;
                  }

                  if (to < element_item.logoutTime != null ? getTimeAsNumber(element_item.logoutTime) : getTimeAsNumber(element_item.logoutTime, element_item.loginTime)) {
                    to = element_item.logoutTime != null ? getTimeAsNumber(element_item.logoutTime) : getTimeAsNumber(element_item.logoutTime, element_item.loginTime);
                    logoutTime = element_item.logoutTime != null ? moment(element_item.logoutTime) : Number(moment(element_item.loginTime).format("DD")) < Number(moment().format("DD")) ? moment(element_item.loginTime) : moment();
                  }
                }

                record = {
                  login_date_graph: moment(logInTime).unix(),
                  logout_date_graph: logoutTime.unix(),
                  branch: element[0].branch_info.branch_name,
                  from_hr: moment(logInTime).utc().tz('Europe/Madrid').format("hh:mm A"),
                  to_hr: logoutTime.utc().tz('Europe/Madrid').format("hh:mm A"),
                  date: logoutTime.utc().tz('Europe/Madrid').format("DD/MM/YYYY"),
                  from: from,
                  to: to,
                  barista: element[0].barista_info.barista_name,
                  color: element[0].barista_info.color,
                  barista_id: element[0].barista_info._id
                };
                colors.push(element[0].barista_info.color);
                baristas.push(element[0].barista_info._id);

                if (branches.indexOf(element[0].branch_info.branch_name) < 0) {
                  branches.push(element[0].branch_info.branch_name);
                }

                item.push(record);
                response.push(item);
              } else {
                for (_index_j = 0; _index_j < element.length; _index_j++) {
                  _element_item = element[_index_j];
                  _from = getTimeAsNumber(_element_item.loginTime);
                  _to = _element_item.logoutTime != null ? getTimeAsNumber(_element_item.logoutTime) : getTimeAsNumber(_element_item.logoutTime, _element_item.loginTime);
                  toHrDate = _element_item.logoutTime != null ? moment(_element_item.logoutTime) : moment();
                  _record = {
                    login_date_graph: moment(_element_item.loginTime).unix(),
                    logout_date_graph: moment(_element_item.logoutTime == null ? _element_item.loginTime : _element_item.logoutTime).unix(),
                    branch: _element_item.branch_info.branch_name,
                    from_hr: moment(_element_item.loginTime).utc().tz('Europe/Madrid').format("hh:mm A"),
                    to_hr: toHrDate.utc().tz('Europe/Madrid').format("hh:mm A"),
                    date: toHrDate.utc().tz('Europe/Madrid').format("DD/MM/YYYY"),
                    from: _from,
                    to: _to,
                    barista: _element_item.barista_info.barista_name,
                    color: _element_item.barista_info.color,
                    barista_id: element[0].barista_info._id
                  };
                  colors.push(_element_item.barista_info.color);
                  baristas.push(_element_item.barista_info._id);

                  if (branches.indexOf(_element_item.branch_info.branch_name) < 0) {
                    branches.push(_element_item.branch_info.branch_name);
                  }

                  response.push([_record]);
                }
              }
            } else {
              for (_index_j2 = 0; _index_j2 < element.length; _index_j2++) {
                _element_item2 = element[_index_j2];
                _from2 = getTimeAsNumber(_element_item2.loginTime);
                _to2 = _element_item2.logoutTime != null ? getTimeAsNumber(_element_item2.logoutTime) : getTimeAsNumber(_element_item2.logoutTime, _element_item2.loginTime);
                toHrDate = _element_item2.logoutTime != null ? moment(_element_item2.logoutTime) : moment();
                _record2 = {
                  login_date_graph: moment(_element_item2.loginTime).unix(),
                  logout_date_graph: moment(_element_item2.logoutTime).unix(),
                  branch: _element_item2.branch_info.branch_name,
                  from_hr: moment(_element_item2.loginTime).utc().tz('Europe/Madrid').format("hh:mm A"),
                  to_hr: toHrDate.utc().tz('Europe/Madrid').format("hh:mm A"),
                  date: toHrDate.utc().tz('Europe/Madrid').format("DD/MM/YYYY"),
                  from: _from2,
                  to: _to2,
                  barista: _element_item2.barista_info.barista_name,
                  color: _element_item2.barista_info.color,
                  barista_id: element[0].barista_info._id
                };
                colors.push(_element_item2.barista_info.color);
                baristas.push(_element_item2.barista_info._id);

                if (branches.indexOf(_element_item2.branch_info.branch_name) < 0) {
                  branches.push(_element_item2.branch_info.branch_name);
                }

                item.push(_record2);
              }

              response.push(item);
            }
          }

          return _context6.abrupt("return", res.api(200, "barista detail retrived successfully", {
            response: response,
            branches: branches,
            colors: colors,
            baristas: baristas
          }, true));

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.get_all_barista = function _callee6(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          id = req.body.id;
          _context7.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.get_all_baristas().then(function (barista_details) {
            return res.api(200, "barista detail retrived successfully", {
              barista_details: barista_details
            }, true);
          }));

        case 3:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports.update_test = function _callee7(req, res) {
  var id, data;
  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          id = req.body.id;
          _context8.next = 3;
          return regeneratorRuntime.awrap(ClockinModel.findAll());

        case 3:
          data = _context8.sent;
          data.forEach(function (element) {
            ClockinModel.update({
              loginTime: element.createdAt,
              logoutTime: element.updatedAt
            }, {
              where: {
                _id: element._id
              }
            });
          });
          return _context8.abrupt("return", res.api(200, "barista detail retrived successfully", {
            data: data
          }, true));

        case 6:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports.logout = function _callee8(req, res, _) {
  var _req$body5, id, device_id, branch_info;

  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body5 = req.body, id = _req$body5.id, device_id = _req$body5.device_id; //id => barista id

          _context9.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.get_branchInfo(device_id || ""));

        case 3:
          branch_info = _context9.sent;

          if (!branch_info) {
            _context9.next = 11;
            break;
          }

          _context9.next = 7;
          return regeneratorRuntime.awrap(baristaRepository.clock_out_all(branch_info._id));

        case 7:
          _context9.next = 9;
          return regeneratorRuntime.awrap(baristaRepository.update_login_status(id, false).then(function (update_data) {
            var current_hour = moment().utc().tz(constants.TIME_ZONE).format('H');
            var current_time_slot = "";
            var time_slot = time_slot_hour();

            for (var i = 0; i < time_slot.length; ++i) {
              var current_pair = time_slot[i].split('-');

              if (parseInt(current_pair[0]) == current_hour) {
                current_time_slot = i;
              }
            }

            return update_data[0] > 0 ? res.api(200, "logged out successfully", {
              is_logged_in: false
            }, true) : res.api(200, "No Barista found", null, false);
          }));

        case 9:
          _context9.next = 12;
          break;

        case 11:
          return _context9.abrupt("return", res.api(404, "IPAD not registered to any Branch", null, false));

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  });
};

module.exports.delete_barista = function _callee9(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          id = req.body.id;
          _context10.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.delete_barista(id).then(function (deleteData) {
            return deleteData > 0 ? res.api(200, "deleted successfully", null, true) : res.api(200, "No barista found", null, false);
          }));

        case 3:
        case "end":
          return _context10.stop();
      }
    }
  });
};

module.exports.update_barista_password = function _callee10(req, res, _) {
  var _req$body6, id, old_password, password, barista_details;

  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _req$body6 = req.body, id = _req$body6.id, old_password = _req$body6.old_password, password = _req$body6.password;
          _context11.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.get_barista_details({
            "_id": id
          }));

        case 3:
          barista_details = _context11.sent;

          if (!(old_password != null && old_password != undefined && password != null && password != undefined)) {
            _context11.next = 13;
            break;
          }

          if (!barista_details) {
            _context11.next = 10;
            break;
          }

          _context11.next = 8;
          return regeneratorRuntime.awrap(comparePassword(old_password, barista_details.password).then(function (authStatus) {
            return authStatus ? encryptPassword(password, function (err, hash) {
              baristaRepository.update_password(id, hash).then(function (_) {
                res.api(200, "password updated successfully", {
                  barista_details: barista_details
                }, true);
              });
            }) : res.api(200, "Incorrect password, please contact admin!", null, false);
          }));

        case 8:
          _context11.next = 11;
          break;

        case 10:
          return _context11.abrupt("return", res.api(200, "No barista found", {
            barista_details: barista_details
          }, false));

        case 11:
          _context11.next = 14;
          break;

        case 13:
          return _context11.abrupt("return", res.api(200, "Please check your params", {
            barista_details: barista_details
          }, false));

        case 14:
        case "end":
          return _context11.stop();
      }
    }
  });
};

module.exports.update_barista_password = function _callee11(req, res, _) {
  var _req$body7, _id, user_name, password, barista_details;

  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _req$body7 = req.body, _id = _req$body7._id, user_name = _req$body7.user_name, password = _req$body7.password;
          _context12.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.get_barista_details({
            "_id": _id
          }));

        case 3:
          barista_details = _context12.sent;

          if (!barista_details) {
            _context12.next = 8;
            break;
          }

          if (user_name != "" && password != "" && user_name != null && password != null && user_name != undefined && password != undefined) {
            encryptPassword(password, function (err, hash) {
              baristaRepository.update_user_and_pwd(_id, user_name, hash).then(function (_) {
                res.api(200, "barista details updated successfully", {
                  barista_details: barista_details
                }, true);
              });
            });
          } else if (password != null && password != undefined && password != "") {
            encryptPassword(password, function (err, hash) {
              baristaRepository.update_password(_id, hash).then(function (_) {
                res.api(200, "password updated successfully", {
                  barista_details: barista_details
                }, true);
              });
            });
          } else {
            if (user_name != "") {
              baristaRepository.update_user_name(_id, user_name).then(function (_) {
                res.api(200, "barista name updated successfully", {
                  barista_details: barista_details
                }, true);
              });
            } else {
              res.api(20, "barista name could not be empty", null, false);
            }
          }

          _context12.next = 9;
          break;

        case 8:
          return _context12.abrupt("return", res.api(200, "No barista found", {
            barista_details: barista_details
          }, false));

        case 9:
        case "end":
          return _context12.stop();
      }
    }
  });
};

module.exports.clockout = function _callee12(req, res, _) {
  var _req$body8, device_id, active_barista_id, barista_id, branch_info;

  return regeneratorRuntime.async(function _callee12$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$body8 = req.body, device_id = _req$body8.device_id, active_barista_id = _req$body8.active_barista_id, barista_id = _req$body8.barista_id;

          if (!(active_barista_id == barista_id)) {
            _context13.next = 5;
            break;
          }

          return _context13.abrupt("return", res.api(200, "Could not clock out, pls make sure that he is not a active barista", null, false));

        case 5:
          _context13.next = 7;
          return regeneratorRuntime.awrap(baristaRepository.get_branchInfo(device_id || ""));

        case 7:
          branch_info = _context13.sent;

          if (!branch_info) {
            _context13.next = 14;
            break;
          }

          _context13.next = 11;
          return regeneratorRuntime.awrap(baristaRepository.clock_out(branch_info._id, barista_id));

        case 11:
          return _context13.abrupt("return", res.api(200, "Clocked out successfully", null, true));

        case 14:
          return _context13.abrupt("return", res.api(404, "IPAD not registered to any Branch", null, false));

        case 15:
        case "end":
          return _context13.stop();
      }
    }
  });
};

module.exports.switch_user = function _callee13(req, res, _) {
  var _req$body9, device_id, old_barista_id, new_barista_id, clockoutBarista, branch_info;

  return regeneratorRuntime.async(function _callee13$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _req$body9 = req.body, device_id = _req$body9.device_id, old_barista_id = _req$body9.old_barista_id, new_barista_id = _req$body9.new_barista_id, clockoutBarista = _req$body9.clockoutBarista;
          _context14.next = 3;
          return regeneratorRuntime.awrap(baristaRepository.get_branchInfo(device_id || ""));

        case 3:
          branch_info = _context14.sent;

          if (!branch_info) {
            _context14.next = 14;
            break;
          }

          if (!(clockoutBarista == true)) {
            _context14.next = 8;
            break;
          }

          _context14.next = 8;
          return regeneratorRuntime.awrap(baristaRepository.clock_out(branch_info._id, old_barista_id));

        case 8:
          baristaRepository.switch_user(branch_info._id, old_barista_id, false);
          _context14.next = 11;
          return regeneratorRuntime.awrap(baristaRepository.switch_user(branch_info._id, new_barista_id, true));

        case 11:
          return _context14.abrupt("return", res.api(200, "switched successfully", null, true));

        case 14:
          return _context14.abrupt("return", res.api(404, "IPAD not registered to any Branch", null, false));

        case 15:
        case "end":
          return _context14.stop();
      }
    }
  });
};

module.exports.get_branch_logged_in_users = function _callee14(req, res, _) {
  var device_id, branch_info, user_list;
  return regeneratorRuntime.async(function _callee14$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          device_id = req.body.device_id;
          console.log(req.body);
          _context15.next = 4;
          return regeneratorRuntime.awrap(baristaRepository.get_branchInfo(device_id || ""));

        case 4:
          branch_info = _context15.sent;

          if (!branch_info) {
            _context15.next = 13;
            break;
          }

          _context15.next = 8;
          return regeneratorRuntime.awrap(baristaRepository.getClockin(branch_info._id));

        case 8:
          user_list = _context15.sent;
          console.log(JSON.parse(JSON.stringify(user_list)));
          return _context15.abrupt("return", res.api(200, "list retrived", user_list, true));

        case 13:
          return _context15.abrupt("return", res.api(404, "IPAD not registered to any Branch", null, false));

        case 14:
        case "end":
          return _context15.stop();
      }
    }
  });
};