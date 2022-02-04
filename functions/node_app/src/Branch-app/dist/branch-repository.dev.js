"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./Branch-model'),
    BrancheModel = _require.BrancheModel;

var BranchRepository =
/*#__PURE__*/
function () {
  function BranchRepository() {
    _classCallCheck(this, BranchRepository);
  }

  _createClass(BranchRepository, [{
    key: "addBranch",
    value: function addBranch(branch_name, device_id, admin_id, lat, lng, show_on_app) {
      return BrancheModel.create({
        created_by: admin_id,
        branch_name: branch_name,
        device_id: device_id,
        lat: lat,
        lng: lng,
        show_on_app: show_on_app,
        espresso_report_date: espresso_report_date
      });
    }
  }, {
    key: "getBranches",
    value: function getBranches(id) {
      return id ? BrancheModel.findOne({
        where: {
          _id: id
        }
      }) : BrancheModel.findAll({
        order: [["createdAt", "DESc"]]
      });
    }
  }, {
    key: "deleteBranch",
    value: function deleteBranch(id) {
      return BrancheModel.destroy({
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "update_branch",
    value: function update_branch(id, query) {
      return BrancheModel.update(query, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "isUniqueCode",
    value: function isUniqueCode(device_id) {
      return BrancheModel.findOne({
        where: {
          device_id: device_id
        }
      });
    }
  }]);

  return BranchRepository;
}();

module.exports.branchRepository = new BranchRepository();