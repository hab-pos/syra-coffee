"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../../User_App/User-model'),
    MyCartModel = _require.MyCartModel;

var _require2 = require('../ModifiersApp/modifier-model'),
    ModifiersModel = _require2.ModifiersModel;

var _require3 = require('../Products_app/products-model'),
    UserProducts = _require3.UserProducts;

var _require4 = require('./events-model'),
    EventProducts = _require4.EventProducts,
    SyraEvents = _require4.SyraEvents;

var EventRepository =
/*#__PURE__*/
function () {
  function EventRepository() {
    _classCallCheck(this, EventRepository);
  }

  _createClass(EventRepository, [{
    key: "addEvent",
    value: function addEvent(data) {
      return SyraEvents.create({
        event_name: data.event_name,
        start_date: data.start_date,
        end_date: data.end_date,
        reward_mode: data.reward_mode,
        amount: data.amount,
        products: data.products,
        thumbnail_name: data.thumbnail_name,
        thumbnail_url: data.thumbnail_url,
        cover_name: data.cover_name,
        cover_url: data.cover_url,
        description: data.description,
        order: data.order,
        is_deleted: data.is_deleted
      });
    } // include: [
    //     { model: IVAModel, as: "iva_info"},
    //     {model: UserCategories, as: "category_details"}
    // ] 
    // include: [{
    //     model: UserProducts, as: "product_info"
    // }],

  }, {
    key: "getEvent",
    value: function getEvent(id) {
      return id ? SyraEvents.findOne({
        where: {
          _id: id
        },
        include: [{
          model: UserProducts,
          as: "product_info"
        }]
      }) : SyraEvents.findAll({
        where: {
          is_deleted: false
        },
        order: [["createdAt", "DESC"]],
        include: [{
          model: UserProducts,
          as: "product_info"
        }]
      });
    }
  }, {
    key: "deleteEvent",
    value: function deleteEvent(id) {
      return SyraEvents.update({
        is_deleted: true
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "updateEvent",
    value: function updateEvent(query) {
      return SyraEvents.update(query, {
        where: {
          _id: query._id
        }
      });
    }
  }]);

  return EventRepository;
}();

module.exports.EventRepository = new EventRepository();