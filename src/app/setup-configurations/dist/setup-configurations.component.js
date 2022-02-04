"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SetupConfigurationsComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var delete_component_1 = require("../shared/components/delete/delete.component");
var SetupConfigurationsComponent = /** @class */ (function () {
    function SetupConfigurationsComponent(commonService, apiService, modalService) {
        this.commonService = commonService;
        this.apiService = apiService;
        this.modalService = modalService;
        this.iva = [];
        this.expense = [];
        this.discounts = [];
        this.Pagewidth = 0;
        this.display_col_iva = ["percent", "icon"];
        this.display_col_exp = ["expense_name", "icon"];
        this.display_col_discounts = ["discount_name", "discount_percent", "icon"];
        this.faTimes = free_solid_svg_icons_1.faTimes;
        this.faArrowsAlt = free_solid_svg_icons_1.faArrowsAlt;
        this.faPlusCircle = free_solid_svg_icons_1.faPlusCircle;
        this.field = '';
        this.isLoadingDiscount = false;
        this.isLoadingExpense = false;
        this.isLoadingIVA = false;
    }
    SetupConfigurationsComponent.prototype.ngOnInit = function () {
        this.Pagewidth = window.innerWidth;
        console.log(innerWidth);
        this.listener();
        this.get_iva();
        this.get_expenses();
        this.get_discount();
    };
    SetupConfigurationsComponent.prototype.action = function () {
        console.log("clicked");
    };
    SetupConfigurationsComponent.prototype.dropTable = function (event) {
        var _this = this;
        var prevIndex = this.discounts.findIndex(function (d) { return d === event.item.data; });
        drag_drop_1.moveItemInArray(this.discounts, prevIndex, event.currentIndex);
        this.table.renderRows();
        var array = [];
        for (var index = 0; index < this.discounts.length; index++) {
            var element = this.discounts[index];
            var item = { id: element._id, order: index + 1 };
            array.push(item);
        }
        this.isLoadingDiscount = true;
        this.apiService.orderDiscounts({ order: array }).subscribe(function (response) {
            _this.isLoadingDiscount = false;
        });
    };
    SetupConfigurationsComponent.prototype.listener = function () {
        var _this = this;
        this.commonService.commonEmitter.subscribe(function () {
            switch (_this.field) {
                case "iva":
                    _this.get_iva();
                    break;
                case "expense":
                    _this.get_expenses();
                    break;
                default:
                    _this.get_discount();
            }
        });
    };
    SetupConfigurationsComponent.prototype.get_iva = function () {
        var _this = this;
        this.isLoadingIVA = true;
        this.apiService.getIVA().subscribe(function (res) {
            _this.isLoadingIVA = false;
            _this.iva = res.data.ivalist;
        });
    };
    SetupConfigurationsComponent.prototype.get_discount = function () {
        var _this = this;
        this.isLoadingDiscount = true;
        this.apiService.getDiscount().subscribe(function (res) {
            _this.discounts = res.data.discount_list;
            _this.isLoadingDiscount = false;
            console.log(res);
        });
    };
    SetupConfigurationsComponent.prototype.get_expenses = function () {
        var _this = this;
        this.isLoadingExpense = true;
        this.apiService.getExpense().subscribe(function (res) {
            console.log(res);
            _this.isLoadingExpense = false;
            _this.expense = res.data.expense_list;
        });
    };
    SetupConfigurationsComponent.prototype.deleteIva = function (row) {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.isLoadingIVA = true;
            _this.apiService.deleteIVA({ id: _this.iva[row]._id }).subscribe(function (res) {
                _this.commonService.showAlert(res.message);
                if (res.success) {
                    _this.isLoadingIVA = false;
                    _this.get_iva();
                }
            });
        }, function () {
        });
    };
    SetupConfigurationsComponent.prototype.deleteExpense = function (row) {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.isLoadingExpense = true;
            _this.apiService.deleteExpense({ id: _this.expense[row]._id }).subscribe(function (res) {
                _this.commonService.showAlert(res.message);
                _this.isLoadingExpense = false;
                if (res.success) {
                    _this.get_expenses();
                }
            });
        }, function () {
        });
    };
    SetupConfigurationsComponent.prototype.deleteDiscount = function (row) {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.isLoadingDiscount = true;
            _this.apiService.deleteDiscount({ id: _this.discounts[row]._id }).subscribe(function (res) {
                _this.commonService.showAlert(res.message);
                _this.isLoadingDiscount = false;
                if (res.success) {
                    _this.get_discount();
                }
            });
        }, function () {
        });
    };
    SetupConfigurationsComponent.prototype.onResize = function (event) {
        this.Pagewidth = window.innerWidth;
    };
    SetupConfigurationsComponent.prototype.openSideBar = function (field) {
        this.field = field;
        this.sidenav.toggle();
    };
    SetupConfigurationsComponent.prototype.push = function () {
        this.commonService.setupEmitter.emit();
    };
    SetupConfigurationsComponent.prototype.closed = function () {
        this.commonService.resetForms.emit();
    };
    __decorate([
        core_1.ViewChild('sidenav')
    ], SetupConfigurationsComponent.prototype, "sidenav");
    __decorate([
        core_1.ViewChild('table')
    ], SetupConfigurationsComponent.prototype, "table");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], SetupConfigurationsComponent.prototype, "onResize");
    SetupConfigurationsComponent = __decorate([
        core_1.Component({
            selector: 'app-setup-configurations',
            templateUrl: './setup-configurations.component.html',
            styleUrls: ['./setup-configurations.component.scss']
        })
    ], SetupConfigurationsComponent);
    return SetupConfigurationsComponent;
}());
exports.SetupConfigurationsComponent = SetupConfigurationsComponent;
