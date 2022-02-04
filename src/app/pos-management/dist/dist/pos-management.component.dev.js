"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.POSManagementComponent = void 0;

var core_1 = require("@angular/core");

var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");

var drag_drop_1 = require("@angular/cdk/drag-drop");

var POSManagementComponent =
/** @class */
function () {
  function POSManagementComponent(router, activeRoute) {
    this.router = router;
    this.activeRoute = activeRoute;
    this.Pagewidth = 0;
    this.faPlusCircle = free_solid_svg_icons_1.faPlusCircle;
    this.faPencilAlt = free_solid_svg_icons_1.faPencilAlt;
    this.faArrowsAlt = free_solid_svg_icons_1.faArrowsAlt;
    this.field = '';
    this.action = '';
    this.category = [{
      _id: "category_1",
      color: "#4751c9",
      category_name: "Coffee",
      is_active: true
    }, {
      _id: "category_2",
      color: "#45a9ea",
      category_name: "Cold",
      is_active: false
    }, {
      _id: "category_3",
      color: "#cc6ae3",
      category_name: "Cookies",
      is_active: true
    }, {
      _id: "category_4",
      color: "#dea766",
      category_name: "Coffee Bags",
      is_active: false
    }, {
      _id: "category_5",
      color: "#7c52cb",
      category_name: "Corner Shop",
      is_active: true
    }, {
      _id: "category_6",
      color: "#16a186",
      category_name: "Tea",
      is_active: true
    }, {
      _id: "category_7",
      color: "#d90368",
      category_name: "cappuccino",
      is_active: true
    }];
    this.products = [{
      _id: "p1",
      color: "#4751c9",
      product_name: "Espresso",
      is_active: true
    }, {
      _id: "p1",
      color: "#4751c9",
      product_name: "Espresso Doble",
      is_active: true
    }, {
      _id: "p1",
      color: "#ef18c1",
      product_name: "Cortado",
      is_active: false
    }, {
      _id: "p1",
      color: "#d90368",
      product_name: "Latte/Cappucino",
      is_active: false
    }, {
      _id: "p1",
      color: "#45a9ea",
      product_name: "Flat White",
      is_active: true
    }, {
      _id: "p1",
      color: "#4751c9",
      product_name: "Mocha",
      is_active: true
    }, {
      _id: "p1",
      color: "#4751c9",
      product_name: "Batch Brew",
      is_active: true
    }, {
      _id: "p1",
      color: "#4751c9",
      product_name: "Americano",
      is_active: true
    }, {
      _id: "p1",
      color: "#4751c9",
      product_name: "Hot Chocolate",
      is_active: false
    }, {
      _id: "p1",
      color: "#45a9ea",
      product_name: "Oat Milk",
      is_active: true
    }, {
      _id: "p1",
      color: "#45a9ea",
      product_name: "Almond Milk",
      is_active: true
    }, {
      _id: "p1",
      color: "#dea766",
      product_name: "Iced",
      is_active: false
    }, {
      _id: "p1",
      color: "#dea766",
      product_name: "Matcha Latte",
      is_active: true
    }, {
      _id: "p1",
      color: "#7c52cb",
      product_name: "Chai Latte",
      is_active: true
    }, {
      _id: "p1",
      color: "#16a186",
      product_name: "Vaso Leche",
      is_active: true
    }, {
      _id: "p1",
      color: "#45a9ea",
      product_name: "Double Shot",
      is_active: false
    }, {
      _id: "p1",
      color: "#16a186",
      product_name: "Cold coffee",
      is_active: true
    }, {
      _id: "p1",
      color: "#d90368",
      product_name: "Camal milk coffee",
      is_active: true
    }, {
      _id: "p1",
      color: "#ef18c1",
      product_name: "Green Tea",
      is_active: true
    }];
    this.display_col_category = ["name_color", "action"];
    this.Pagewidth = window.innerWidth;
  }

  POSManagementComponent.prototype.ngAfterViewInit = function () {
    this.paramsFromParent = this.activeRoute.snapshot.paramMap;

    if (this.paramsFromParent.get("toAddCategory")) {
      this.openSideBar('add', 'category');
    }
  };

  POSManagementComponent.prototype.dropTable = function (event) {
    var prevIndex = this.category.findIndex(function (d) {
      return d === event.item.data;
    });
    drag_drop_1.moveItemInArray(this.category, prevIndex, event.currentIndex);
    this.table.renderRows();
  };

  POSManagementComponent.prototype.dropProducts = function (event) {
    var index = this.products.findIndex(function (d) {
      return d === event.item.data;
    });
    drag_drop_1.moveItemInArray(this.products, index, event.currentIndex);
    this.ProductsTable.renderRows();
  };

  POSManagementComponent.prototype.onResize = function (event) {
    this.Pagewidth = window.innerWidth;
  };

  POSManagementComponent.prototype.openSideBar = function (field, action) {
    this.field = field;
    this.action = action;
    this.sidenav.toggle();
  };

  __decorate([core_1.ViewChild('table')], POSManagementComponent.prototype, "table");

  __decorate([core_1.ViewChild('products_table')], POSManagementComponent.prototype, "ProductsTable");

  __decorate([core_1.ViewChild('sidenav')], POSManagementComponent.prototype, "sidenav");

  __decorate([core_1.HostListener('window:resize', ['$event'])], POSManagementComponent.prototype, "onResize");

  POSManagementComponent = __decorate([core_1.Component({
    selector: 'app-pos-management',
    templateUrl: './pos-management.component.html',
    styleUrls: ['./pos-management.component.scss']
  })], POSManagementComponent);
  return POSManagementComponent;
}();

exports.POSManagementComponent = POSManagementComponent;