"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./story-model'),
    StoryModel = _require.StoryModel;

var _require2 = require('../Products_app/products-model'),
    UserProducts = _require2.UserProducts; // {_id,title,products,thumbnail_name,thumbnail_url,story_name,story_url,story_content,order,is_deleted}


var StoryReporstory =
/*#__PURE__*/
function () {
  function StoryReporstory() {
    _classCallCheck(this, StoryReporstory);
  }

  _createClass(StoryReporstory, [{
    key: "addStory",
    value: function addStory(data) {
      console.log(data);
      return StoryModel.create({
        title: data.title,
        products: data.products[0],
        thumbnail_name: data.thumbnail_name,
        thumbnail_url: data.thumbnail_url,
        story_name: data.story_name,
        story_url: data.story_url,
        story_content: data.story_content,
        order: data.order,
        is_deleted: data.is_deleted
      });
    } // include: [
    //     { model: UserProducts, as: "product_info"},
    // ] 

  }, {
    key: "getStory",
    value: function getStory(id) {
      return id ? StoryModel.findOne({
        where: {
          _id: id
        },
        include: [{
          model: UserProducts,
          as: "product_info"
        }]
      }) : StoryModel.findAll({
        where: {
          is_deleted: false
        },
        order: [["order", "ASC"], ["createdAt", "DESC"]],
        include: [{
          model: UserProducts,
          as: "product_info"
        }]
      });
    }
  }, {
    key: "deleteStory",
    value: function deleteStory(id) {
      return StoryModel.update({
        is_deleted: true
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "updateStory",
    value: function updateStory(query) {
      return StoryModel.update(query, {
        where: {
          _id: query._id
        }
      });
    }
  }]);

  return StoryReporstory;
}();

module.exports.StoryReporstory = new StoryReporstory();